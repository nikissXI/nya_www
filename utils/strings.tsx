import hash from "hash.js";
import { openToast } from "@/components/universal/toast";
import {
  RiSignalCellular3Fill,
  RiSignalCellular2Fill,
  RiSignalCellular1Fill,
} from "react-icons/ri";

export function getHash(contentStr: string): string {
  return hash.sha256().update(contentStr).digest("hex");
}

export function validatePassword(password: string): boolean {
  // 检查密码长度
  if (password.length < 8) {
    return false;
  }
  // 检查是否包含数字
  const hasNumber = /[0-9]/.test(password);
  // 检查是否包含字母
  const hasCase = /[A-Za-z]/.test(password);
  // 返回最终结果
  return hasNumber && hasCase;
}

export function validateTel(tel: string): boolean {
  const phoneRegex = /^[1][3-9][0-9]{9}$/; // 中国大陆手机号正则
  return phoneRegex.test(tel);
}

export function isInteger(value: string): boolean {
  const regex = /^[0-9]+$/; // 仅允许 0 到 9 的数字
  return regex.test(value);
}

/** 校验两次密码输入，返回提示文案（空字符串表示通过） */
export function getPasswordAlertText(
  password: string,
  passwordAgain: string,
): string {
  if (password && passwordAgain && password !== passwordAgain) {
    return "两次输入的密码不一致";
  }
  if (password && !validatePassword(password)) {
    return "不低于8位，包含数字和字母";
  }
  return "";
}

/** 从各种异常中提取可展示的错误文案 */
export function getErrorMessage(
  error: unknown,
  fallback: string = "请求失败，请重试",
): string {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "string" && error.trim()) return error;
  return fallback;
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const copyText = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && navigator.permissions) {
      await navigator.clipboard.writeText(text);
      openToast({ content: "已复制", status: "info" });
      return true;
    }
    // 不支持自动复制时给出提示，避免用户误以为已经复制成功
    openToast({ content: "复制失败，请手动复制", status: "error" });
    return false;
  } catch {
    openToast({ content: "复制失败，请手动复制", status: "error" });
    return false;
  }
};

const GOOD = "#00e63a";
const SOSO = "#ffb12c";
const BAD = "#ff3737";

export const getNetColor = (net: number) => {
  if (net == -1) return BAD;
  if (net <= 60) return GOOD;
  if (net <= 85) return SOSO;
  return BAD;
};

export const getNetText = (net: number) => {
  if (net == -1) return "故障";
  if (net <= 60) return "空闲";
  if (net <= 85) return "一般";
  return "拥挤";
};

export const getDelayColor = (delay: number) => {
  if (delay < 60) return GOOD;
  if (delay < 120) return SOSO;
  return BAD;
};

export const getDelayIcon = (delay: number) => {
  if (delay < 60) return <RiSignalCellular3Fill size={20} />;
  if (delay < 120) return <RiSignalCellular2Fill size={20} />;
  return <RiSignalCellular1Fill size={20} />;
};

export const getStatusColor = (online: boolean) => {
  if (online) return GOOD;
  return BAD;
};

/** 公告时间戳格式化（兼容秒/毫秒；short 为 true 时只到日） */
export function formatAnnouncementDate(
  rawTs: number,
  short: boolean = false,
): string {
  const ts = rawTs < 1e12 ? rawTs * 1000 : rawTs;
  const d = new Date(ts);

  if (short) return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;

  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");

  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日 ${hours}:${minutes}`;
}
