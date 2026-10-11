import { produce, enableMapSet } from "immer";

enableMapSet();
import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";
import { v4 as uuidv4 } from "uuid";
import { getAuthToken, clearAuthToken } from "../authKey";
import { openToast } from "@/components/universal/toast";
import {
  isBusinessError,
  setUnauthorizedHandler,
  shouldSilenceError,
} from "@/utils/api";
import { api } from "@/utils/endpoints";
import type {
  AnnouncementsData,
  NodeInfo,
  RoomInfo,
  UserInfo,
  UserWgInfo,
} from "@/utils/endpoints";
import { getErrorMessage } from "@/utils/strings";

/**
 * 资源计时缓冲区（performance resource timing）默认只有 250 条，房间页每 5 秒就会写入
 * 2 条（getRoom + 节点 ping），挂十几分钟就写满；写满后浏览器会静默丢弃新条目，
 * 测延迟便查不到自己那条记录 → 表现为弹「xxx节点获取延迟性能记录出错」，
 * 而 F12 里一切正常（请求本身是 200，错误又被 toast 接走了，不会进 console）。
 * 这里把上限抬高一档，并在真的写满时清空一次，避免长期挂机后测速失效。
 */
if (typeof performance !== "undefined") {
  performance.setResourceTimingBufferSize?.(2000);
  performance.onresourcetimingbufferfull = () => {
    performance.clearResourceTimings();
  };
}

interface ILoginStateSlice {
  // 访问唯一标识
  uuid: string;

  // 网站访问数据和关联群
  announcementsData: AnnouncementsData | undefined;
  getAnnouncementsData: () => Promise<void>;

  // 登录加载状态
  loginLoading: boolean;
  // 获取用户信息
  userInfo: UserInfo | undefined;
  userWgInfo: UserWgInfo | undefined;
  getUserInfo: () => Promise<void>;
  // 退出登录
  logout: () => void;

  // 获取邀请码
  getInviteCode: () => void;
  // 是否在app中打开
  getEmbedParama: () => void;
  embed: boolean;

  /**
   * 获取节点延迟
   * @param net 节点负载，-1（故障）时直接返回 0，不做测速
   * @param auto true 时只测一遍（房间页用，请求更轻）；false 时测两遍、必要时再补一遍取最小值
   *
   * 优先用资源计时里的服务端响应耗时；拿不到条目时退回整段请求耗时，不会因此判失败。
   * 超时由 AbortController 真断请求（不留下挂着的连接），网络层失败（Safari 的
   * 「Load failed」）自动重试一次；auto 时的失败不弹提示，交给房间页统一处理
   */
  getNodeLatency: (
    node_alias: string,
    ping_host: string,
    net?: number,
    auto?: boolean,
  ) => Promise<number>;
  // 节点列表
  getNodeListLock: boolean;
  nodeMap: Map<string, NodeInfo>;
  fixedNode: string | undefined;
  getNodeList: () => Promise<void>;

  // 节点选择
  showNodeListModal: boolean;
  setNodeListModal: () => void;
  selectNode: (node_alias: string) => void;
  selectNodeLock: boolean;

  latency: number | undefined;
  nodeNetLoad: number | undefined;
  isOnline: boolean;

  // 刷新房间信息冷却
  disableFlush: boolean;
  // 房间角色
  roomRole: "none" | "member" | "hoster";
  // 加载动画
  rotate: boolean;
  // 房间数据
  roomData: RoomInfo | undefined;
  setRoomPassword: (newPassword: string) => void;
  /**
   * 拉取房间信息。
   * @param silent 默认 true：自动刷新（不弹「刷新成功」、不走手动刷新的 3 秒冷却、失败不弹提示）；
   *   传 false 表示用户手动刷新，会提示成功/失败
   */
  getRoomData: (silent?: boolean) => Promise<void>;

  showRegetModal: boolean;
  setShowRegetModal: () => void;

  showLoginModal: boolean;
  /** 打开登录弹窗（显式 API，避免 toggle 语义在多处调用时错乱） */
  openLoginModal: () => void;
  /** 关闭登录弹窗 */
  closeLoginModal: () => void;
}
export const useUserStateStore = createWithEqualityFn<ILoginStateSlice>(
  (set, get) => {
    // 内部工具：用于限制 Toast 重复
    let lastToastTime = 0;
    const showErrorToast = (content: string) => {
      const now = Date.now();
      if (now - lastToastTime > 3000) {
        // 3秒内只弹一次
        openToast({ content, status: "error" });
        lastToastTime = now;
      }
    };

    return {
      uuid: "",

      getInviteCode: () => {
        const urlParams = new URLSearchParams(window.location.search);
        const inviteCode = urlParams.get("i");
        if (inviteCode) {
          localStorage.setItem("inviteCode", inviteCode);
        }
      },

      getEmbedParama: () => {
        const urlParams = new URLSearchParams(window.location.search);
        const embed = urlParams.get("embed");
        if (embed) {
          set({ embed: true });
        }
      },
      embed: false,
      announcementsData: undefined,
      getAnnouncementsData: async () => {
        try {
          const data = await api.announcements();
          set({ announcementsData: data ?? undefined });
        } catch (error) {
          // 静默失败，不影响使用
          console.warn("获取公告数据失败", error);
        }
      },

      loginLoading: true,
      userInfo: undefined,
      userWgInfo: undefined,
      getUserInfo: async () => {
        set({ loginLoading: true });

        const _uuid = localStorage.getItem("uuid");
        if (_uuid) {
          set({ uuid: _uuid });
        } else {
          const new_uuid = uuidv4();
          set({ uuid: new_uuid });
          localStorage.setItem("uuid", new_uuid);
        }

        if (!getAuthToken()) {
          set({ loginLoading: false });
          return;
        }

        try {
          const data = await api.userInfo();

          if (data.reget_ip) {
            get().setShowRegetModal();
          }

          set({ userInfo: data.user_info });

          if (data?.user_wg_info) {
            set({ userWgInfo: data.user_wg_info });
          } else {
            get().setNodeListModal();
          }
        } catch (error) {
          // 凭证失效已由全局 handler 统一登出并提示，这里不再重复
          if (shouldSilenceError(error)) return;

          openToast({
            content: getErrorMessage(error, "服务器出错，请稍后再试"),
            status: "error",
          });
        } finally {
          // 改动：确保在 finally 中重置加载状态
          set({ loginLoading: false });
        }
      },

      logout: () => {
        clearAuthToken();
        const new_uuid = uuidv4();
        set({
          uuid: new_uuid,
          userInfo: undefined,
          userWgInfo: undefined,
          roomRole: "none",
          roomData: undefined,
          latency: undefined,
          nodeNetLoad: undefined,
          fixedNode: undefined,
        });
        localStorage.setItem("uuid", new_uuid);
      },

      // 改动：增加清理性能条目的逻辑，避免旧条目干扰
      getNodeLatency: async (
        node_alias: string,
        ping_host: string,
        net: number = 0,
        auto: boolean = false,
      ) => {
        // 节点离线（net 为 -1）时不必测速，直接返回 0，避免无意义超时等待
        if (net === -1) return 0;

        const statusUrl = `https://${ping_host}/ping`;

        /**
         * 测一次（真实发请求）。
         * ------------------------------------------------------------------
         * 超时必须由 AbortController 真的把请求断掉：原来只做 Promise.race，
         * 上层 3 秒后就拿到「超时」继续往下走，但那条 fetch 还挂在浏览器里，
         * 要等系统自己的连接超时（约 1 分钟）才释放。
         * 节点列表一次要 ping 34 个域名（并发多个），iOS Safari 的连接 / DNS
         * 额度比桌面小得多，挂着的请求会把额度占满，之后新请求直接失败 ——
         * WebKit 把这种网络层失败报成「Load failed」（Chrome 是「Failed to fetch」），
         * 这就是手机上「部分节点概率性 Load failed、等 1 分钟又自己好了」的来源。
         */
        const pingOnce = async (timeout: number): Promise<number> => {
          const controller = new AbortController();
          const timer = setTimeout(() => controller.abort(), timeout);

          try {
            // no-store 保证每次都是真实请求，否则命中缓存会读到旧的 performance 条目
            const start = performance.now();
            const resp = await fetch(statusUrl, {
              cache: "no-store",
              signal: controller.signal,
            });
            // 整段请求耗时：拿不到资源计时条目时的兜底值
            const requestTime = performance.now() - start;

            if (!resp.ok) {
              throw new Error(`${node_alias}节点获取延迟出错`);
            }

            // 把（0 字节的）响应体读完：只 fetch 不读 body 时浏览器会当成请求被取消，
            // Chromium 直接报 net::ERR_ABORTED，等于每次测速都白重置一次连接 / HTTP/2 流，
            // 手机上几十个域名并发测速时没必要留这种脏收尾
            await resp.arrayBuffer();
            await new Promise((resolve) => setTimeout(resolve, 100));

            // 同一个 URL 的条目按时间顺序追加，最后一条即本次请求
            const lastEntry = performance
              .getEntriesByName(statusUrl)
              .at(-1) as PerformanceResourceTiming | undefined;

            // 优先用服务端响应耗时（responseStart - requestStart，不含建连/下载，
            // 更接近节点到你的延迟）；但它不一定有：缓冲区写满时新条目会被静默丢弃，
            // 跨域节点没回 Timing-Allow-Origin 时这两个时间点又都是 0。
            // 这些情况退回整段请求耗时，别让测速直接失败
            const responseTime = lastEntry
              ? lastEntry.responseStart - lastEntry.requestStart
              : 0;

            // 两种取值都可能 <1ms，向上取到 1，否则会被上层当成「无效测量（0）」
            const delay = Math.max(
              1,
              Math.floor(responseTime > 0 ? responseTime : requestTime),
            );
            return Math.min(delay, 999);
          } finally {
            // 请求已结束，定时器同时回收（原来的 race 写法不会清）
            clearTimeout(timer);
          }
        };

        const singlePing = async (first: boolean = false): Promise<number> => {
          try {
            return await pingOnce(first ? 3000 : 1000);
          } catch (error) {
            // 自己 abort 的（即超时）→ 999，让上层按超时处理
            if ((error as { name?: string } | null)?.name === "AbortError") {
              return 999;
            }

            // fetch 在网络层失败抛的是 TypeError（Safari「Load failed」/ Chrome
            // 「Failed to fetch」）：移动网络下多是瞬时的 DNS / TLS / 连接失败，
            // 隔 300ms 重试一次基本就能过；再失败才交给上层提示
            if (error instanceof TypeError) {
              await new Promise((resolve) => setTimeout(resolve, 300));
              return await pingOnce(1000);
            }

            throw error;
          }
        };

        try {
          // 0 表示本次测量无效（拿不到性能条目），999 表示超时
          // auto（房间页）只测一遍，减少对节点的请求；否则测两遍，无效时再补一遍
          const measured = auto
            ? [await singlePing(true)]
            : [await singlePing(true), await singlePing()];

          if (!auto && measured.some((delay) => delay <= 0 || delay >= 999)) {
            measured.push(await singlePing());
          }

          const validDelays = measured.filter(
            (delay) => delay > 0 && delay < 999,
          );
          const minDelay =
            validDelays.length > 0
              ? Math.min(...validDelays)
              : Math.min(...measured);

          // 更新 nodeMap 中的延迟
          set(
            produce((draft) => {
              const draftNode = draft.nodeMap.get(node_alias);
              if (draftNode) {
                draftNode.delay = minDelay;
              }
            }),
          );

          return minDelay;
        } catch (error) {
          // 改动：减少错误 Toast，使用防抖
          // fetch 在网络层失败时抛的是 TypeError，message 是浏览器给的英文
          // （Safari「Load failed」/ Chrome「Failed to fetch」），直接弹给用户看不懂，
          // 换成和 utils/api.ts 一致的中文文案
          const content =
            error instanceof TypeError
              ? `${node_alias}节点连接失败，请检查网络后重试`
              : error instanceof Error
                ? error.message
                : "节点延迟测量失败";

          // auto 是房间页在用（5 秒轮询 + 手动刷新）：后台轮询要完全静默，
          // 手动刷新时房间页自己会提示，不该再被网络错误弹窗刷屏
          if (!auto) showErrorToast(content);

          set(
            produce((draft) => {
              const draftNode = draft.nodeMap.get(node_alias);
              if (draftNode) {
                draftNode.delay = 0;
              }
            }),
          );
          return 0;
        }
      },

      getNodeListLock: false,
      nodeMap: new Map<string, NodeInfo>(),
      fixedNode: undefined,
      getNodeList: async () => {
        if (get().getNodeListLock) return;
        set({ getNodeListLock: true });

        const nowUserWgInfo = get().userWgInfo;
        if (nowUserWgInfo) {
          set({ fixedNode: nowUserWgInfo.node_alias });
        }

        try {
          const nodes = (await api.nodeList()) ?? [];

          set({
            nodeMap: new Map<string, NodeInfo>(nodes.map((n) => [n.alias, n])),
          });

          // 一批并发几个：34 个节点就是 34 个不同域名，手机浏览器（尤其 iOS Safari）
          // 同时开太多连接 / DNS 查询会让部分请求直接失败，这里压到 6 个一批
          const batchSize = 6;
          for (let i = 0; i < nodes.length; i += batchSize) {
            const batch = nodes.slice(i, i + batchSize);
            await Promise.all(
              batch.map((node) =>
                get().getNodeLatency(node.alias, node.ping_host, node.net),
              ),
            );
          }
        } catch (error) {
          openToast({ content: "节点列表刷新失败", status: "error" });
        } finally {
          performance.clearResourceTimings();
          set({ getNodeListLock: false });
        }
      },

      showNodeListModal: false,
      setNodeListModal: () => {
        const showModal = get().showNodeListModal;
        if (!showModal) {
          get().getNodeList();
        }
        set({ showNodeListModal: !showModal });
      },

      selectNodeLock: false,
      selectNode: async (node_alias: string) => {
        try {
          set({ selectNodeLock: true });

          const { code, msg, data } = await api.selectNode(node_alias);

          if (code === 0) {
            set({
              userWgInfo: data ?? undefined,
              roomData: undefined, // 切换节点后清空房间数据，触发重新获取
            });
            openToast({ content: msg ?? "节点切换成功", status: "success" });
          } else {
            openToast({ content: msg ?? "节点切换失败", status: "warning" });
          }
        } catch (error) {
          // 凭证失效已由统一处理接管
          if (shouldSilenceError(error)) return;

          // 改动：不刷新页面，提示错误
          openToast({
            content: getErrorMessage(error, "节点切换失败，请重试"),
            status: "error",
          });
        } finally {
          set({ selectNodeLock: false });
        }
      },

      latency: undefined,
      nodeNetLoad: undefined,
      isOnline: false,

      disableFlush: false,
      roomRole: "none",
      rotate: false,
      roomData: undefined,

      setRoomPassword: (newPassword: string) => {
        // 简单赋值，不用 produce
        const current = get().roomData;
        if (current) {
          set({ roomData: { ...current, room_passwd: newPassword } });
        }
      },

      getRoomData: async (silent: boolean = true) => {
        try {
          // 冷却逻辑不变
          if (!silent) {
            if (get().disableFlush) return;
            set({ disableFlush: true });
            setTimeout(() => set({ disableFlush: false }), 3000);
          }

          set({ rotate: true });

          // code === -1（客户端数据异常）由 request 统一处理：刷新页面并抛错
          const data = await api.getRoom();

          // --- 核心优化开始 ---

          // 1. 解构后端返回的完整数据
          const isOnline = data.is_online;
          const incomingUserWgInfo = data.user_wg_info; // 后端返回的完整节点信息
          const nodeNetLoad = data.node_net_load;
          const roomData = (data?.room ?? undefined) as RoomInfo | undefined;

          // 2. 【关键】直接用后端返回的最新节点信息覆盖 Store
          //    这一步同时更新了 node_alias, ping_host, net_type, bandwidth 等所有字段
          if (incomingUserWgInfo) {
            set({ userWgInfo: incomingUserWgInfo });
          }

          // 3. 计算房间角色
          const roomRole = roomData
            ? roomData.user_ip === roomData.hoster_ip
              ? "hoster"
              : "member"
            : "none";

          // 4. 批量更新房间相关状态
          set({
            isOnline,
            roomData,
            roomRole,
            nodeNetLoad,
          });

          // 5. 处理延迟检测（此时 get().userWgInfo 已是最新数据）
          const currentWg = get().userWgInfo;
          if (isOnline && currentWg?.ping_host && currentWg?.node_alias) {
            const delay = await get().getNodeLatency(
              currentWg.node_alias,
              currentWg.ping_host,
              undefined,
              true,
            );

            if (get().isOnline && delay === 0) {
              if (!silent) {
                openToast({
                  content: "检测延迟故障，请联系服主处理",
                  status: "error",
                });
              }
            } else {
              if (!silent)
                openToast({ content: "刷新成功", status: "success" });
            }
            set({ latency: delay });
          } else {
            set({ latency: undefined });
            if (!silent) openToast({ content: "刷新成功", status: "success" });
          }

          // --- 核心优化结束 ---
        } catch (error) {
          // 凭证失效 / 数据异常已由统一处理接管，这里不再重复提示
          if (shouldSilenceError(error)) return;

          // 后台轮询失败不打扰用户（手动刷新仍然会提示）
          if (silent) return;

          // 优化：不刷新页面，给予友好提示
          openToast({ content: "获取房间信息失败，请重试", status: "error" });
        } finally {
          set({ rotate: false });
        }
      },

      showRegetModal: false,
      setShowRegetModal: () => {
        set({ showRegetModal: !get().showRegetModal });
      },

      showLoginModal: false,
      openLoginModal: () => set({ showLoginModal: true }),
      closeLoginModal: () => set({ showLoginModal: false }),
    };
  },
  shallow,
);

// ---- 凭证失效统一处理：任何接口带着 token 请求却返回 401，都会走到这里 ----
let lastAuthToastTime = 0;
setUnauthorizedHandler(() => {
  // 重置登录态（内部会清掉 token、房间、隧道等信息）
  useUserStateStore.getState().logout();

  // 并发请求可能同时 401，3 秒内只提示一次
  const now = Date.now();
  if (now - lastAuthToastTime > 3000) {
    openToast({ content: "登录凭证失效", status: "warning" });
    lastAuthToastTime = now;
  }
});
