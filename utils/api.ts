import { clearAuthToken, getAuthToken } from "@/store/authKey";

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();

if (!configuredApiUrl) {
  throw new Error("缺少 VITE_API_URL 环境变量");
}

/** 后端接口根地址 */
export const apiUrl = configuredApiUrl.replace(/\/+$/, "");

/**
 * 全项目统一的后端响应结构
 * 约定：msg / data 没有数据时为 null
 */
export interface ApiEnvelope<T = unknown> {
  code: number;
  msg: string | null;
  data: T | null;
}

/** 后端约定：code = -1 表示客户端数据异常，需要整页刷新 */
const INVALID_DATA_CODE = -1;

/** 没有拿到后端 msg 时，按 HTTP 状态码给出的兜底文案 */
const statusMessage = (status: number): string => {
  if (status === 401) return "登录凭证已失效，请重新登录";
  if (status === 403) return "没有操作权限";
  if (status === 404) return "接口不存在，请更新到最新版本";
  if (status >= 500) return "服务异常，请联系服主处理";
  return `请求失败（HTTP ${status}）`;
};

/** 统一请求异常：message 优先取后端 msg，可直接交给 openToast */
export class ApiError extends Error {
  /** 业务 code，网络/解析失败时为 null */
  readonly code: number | null;
  /** HTTP 状态码，没拿到响应时为 null */
  readonly status: number | null;

  constructor(
    message: string,
    options: { code?: number | null; status?: number | null } = {},
  ) {
    super(message);
    this.name = "ApiError";
    this.code = options.code ?? null;
    this.status = options.status ?? null;
  }

  /** 凭证失效（HTTP 401 或业务 code 401），调用方通常需要登出 */
  get isAuthError(): boolean {
    return this.status === 401 || this.code === 401;
  }

  /** 后端数据异常（code = -1），request 内部已触发整页刷新 */
  get isInvalidData(): boolean {
    return this.code === INVALID_DATA_CODE;
  }
}

type QueryValue = string | number | boolean | null | undefined;

export interface RequestOptions {
  method?: "GET" | "POST";
  /** URL query 参数，值为 null / undefined 的项会被忽略 */
  params?: Record<string, QueryValue>;
  /** 请求体，会自动 JSON 序列化 */
  body?: unknown;
  /** 是否携带 Authorization 头，默认 true */
  auth?: boolean;
  /** 超时毫秒数，0 表示不限制，默认 15000 */
  timeout?: number;
  /** 兜底提示：网络错误或后端 msg 为空时使用 */
  errorMessage?: string;
}

const DEFAULT_TIMEOUT = 15000;

/**
 * 凭证失效的全局处理（由 store 注册为 logout）
 * 这样任何接口返回 401 都能自动登出，页面不用各自处理
 */
let unauthorizedHandler: (() => void) | null = null;

export const setUnauthorizedHandler = (handler: (() => void) | null) => {
  unauthorizedHandler = handler;
};

/** 清掉本地凭证并通知全局处理 */
const handleUnauthorized = () => {
  clearAuthToken();
  unauthorizedHandler?.();
};

const buildUrl = (path: string, params?: Record<string, QueryValue>): string => {
  const url = `${apiUrl}${path.startsWith("/") ? path : `/${path}`}`;
  if (!params) return url;

  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      search.append(key, String(value));
    }
  });

  const query = search.toString();
  return query ? `${url}?${query}` : url;
};

/** 尽力解析响应体，结构不符或非 JSON 时返回 null */
const parseEnvelope = async <T,>(
  resp: Response,
): Promise<ApiEnvelope<T> | null> => {
  try {
    const payload = (await resp.json()) as ApiEnvelope<T>;
    return payload && typeof payload.code === "number" ? payload : null;
  } catch {
    return null;
  }
};

/**
 * 发送请求并返回完整响应体（{code,msg,data}）
 * 只处理 HTTP / 解析层面的异常，业务 code 交给调用方自行判断
 */
export const requestEnvelope = async <T = unknown>(
  path: string,
  options: RequestOptions = {},
): Promise<ApiEnvelope<T>> => {
  const {
    method = "GET",
    params,
    body,
    auth = true,
    timeout = DEFAULT_TIMEOUT,
    errorMessage,
  } = options;

  const headers: Record<string, string> = { Accept: "application/json" };
  const token = auth ? getAuthToken() : null;
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers["Content-Type"] = "application/json";

  const controller = new AbortController();
  const timer =
    timeout > 0 ? setTimeout(() => controller.abort(), timeout) : null;

  try {
    let resp: Response;
    try {
      resp = await fetch(buildUrl(path, params), {
        method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: controller.signal,
      });
    } catch {
      // 网络不通、超时或跨域被拦截
      throw new ApiError(
        errorMessage ??
          (controller.signal.aborted
            ? "请求超时，请稍后重试"
            : "网络异常，请检查网络后重试"),
      );
    }

    const payload = await parseEnvelope<T>(resp);

    if (!resp.ok) {
      // 带着凭证请求仍返回 401 → 凭证失效，统一登出
      // （没带凭证的 401，例如登录密码错误，交给调用方自己处理）
      if (resp.status === 401 && token) handleUnauthorized();

      throw new ApiError(
        payload?.msg ?? errorMessage ?? statusMessage(resp.status),
        { code: payload?.code ?? null, status: resp.status },
      );
    }

    if (!payload) {
      throw new ApiError(errorMessage ?? "响应格式异常，请联系服主处理", {
        status: resp.status,
      });
    }

    // 业务层直接返回凭证失效
    if (payload.code === 401 && token) handleUnauthorized();

    return payload;
  } finally {
    if (timer) clearTimeout(timer);
  }
};

/**
 * 发送请求并直接返回 data
 * - HTTP 出错 / 响应格式异常 → 抛 ApiError
 * - code !== 0 → 抛 ApiError（message 取后端 msg），其中 -1 会先刷新页面
 * - code === 0 → 返回 data（后端无数据时为 null）
 */
export const request = async <T = null>(
  path: string,
  options: RequestOptions = {},
): Promise<T> => {
  const payload = await requestEnvelope<T>(path, options);

  if (payload.code !== 0) {
    if (payload.code === INVALID_DATA_CODE) {
      window.location.reload();
      throw new ApiError(payload.msg ?? "数据异常，正在刷新页面", {
        code: payload.code,
      });
    }

    throw new ApiError(
      payload.msg ?? options.errorMessage ?? "请求失败，请稍后重试",
      { code: payload.code },
    );
  }

  return (payload.data ?? null) as T;
};

/**
 * 是否应该跳过业务提示
 * 凭证失效（已统一登出）、数据异常（已刷新页面）都不需要调用方再弹一次
 */
export const shouldSilenceError = (error: unknown): boolean =>
  error instanceof ApiError && (error.isAuthError || error.isInvalidData);

/** 是否为后端返回的业务失败（能拿到 code，说明服务端正常响应了） */
export const isBusinessError = (error: unknown): error is ApiError =>
  error instanceof ApiError && error.code !== null;
