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
  GetRoomPayload,
  NodeInfo,
  RoomInfo,
  UserInfo,
  UserInfoPayload,
  UserWgInfo,
} from "@/utils/endpoints";
import { getErrorMessage } from "@/utils/strings";

interface ILoginStateSlice {
  // 访问唯一标识
  uuid: string;

  // 网站访问数据和关联群
  announcementsData: AnnouncementsData | undefined;
  getAnnouncementsData: () => Promise<void>;

  // 用于导入隧道的key
  confKey: string | null;
  getConfKey: (manual?: boolean) => void;

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

  // 获取节点延迟
  getNodeLatency: (
    node_alias: string,
    ping_host: string,
    net?: number | null,
  ) => Promise<number>;
  // 节点列表
  getNodeListLock: boolean;
  nodeMap: Map<string, NodeInfo>;
  fixedNode: string | undefined;
  getNodeList: () => Promise<void>;

  needShowReget: boolean;

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
  getRoomData: (auto?: boolean) => Promise<void>;

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

      confKey: null,
      getConfKey: async (manual: boolean = false) => {
        try {
          const confKey = await api.confKey();
          set({ confKey });
          if (manual) openToast({ content: "key激活成功", status: "success" });
        } catch (error) {
          // 凭证失效/数据异常已由统一处理接管
          if (shouldSilenceError(error)) return;

          if (isBusinessError(error)) {
            // 业务失败（如未选择节点），后端 msg 即原因
            openToast({ content: error.message, status: "warning" });
          } else {
            // 改动：不再 reload，而是提示用户重新登录
            openToast({
              content: "获取配置失败，请尝试重新登录",
              status: "error",
            });
          }
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

          if (data?.reget_ip) {
            set({ needShowReget: true });
          }

          set({ userInfo: data?.user_info });

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
          // 清理与账号绑定的数据，避免下一个登录的账号看到上一个账号的信息
          confKey: null,
          fixedNode: undefined,
          needShowReget: false,
        });
        localStorage.setItem("uuid", new_uuid);
      },

      // 改动：增加清理性能条目的逻辑，避免旧条目干扰
      getNodeLatency: async (
        node_alias: string,
        ping_host: string,
        net: number | null = 0,
      ) => {
        // 节点离线（net 为 -1）或负载未知（null）时不必测速，直接返回 0，避免无意义超时等待
        if (net === null || net === -1) return 0;

        const statusUrl = `https://${ping_host}/ping`;

        const singlePing = async (first: boolean = false): Promise<number> => {
          try {
            const timeout = first ? 3000 : 1000;
            const timeoutPromise = new Promise<number>((_, reject) =>
              setTimeout(() => reject(new Error("请求超时")), timeout),
            );

            const pingPromise = (async () => {
              // no-store 保证每次都是真实请求，否则命中缓存会读到旧的 performance 条目
              const resp = await fetch(statusUrl, { cache: "no-store" });
              if (!resp.ok) {
                throw new Error(`${node_alias}节点获取延迟出错`);
              }
              await new Promise((resolve) => setTimeout(resolve, 100));

              // 同一个 URL 的条目按时间顺序追加，最后一条即本次请求
              const lastEntry = performance
                .getEntriesByName(statusUrl)
                .at(-1) as PerformanceResourceTiming | undefined;
              if (lastEntry) {
                const delay = Math.floor(
                  lastEntry.responseStart - lastEntry.requestStart,
                );
                return Math.min(delay, 999);
              } else {
                throw new Error(`${node_alias}节点获取延迟性能记录出错`);
              }
            })();

            return await Promise.race([pingPromise, timeoutPromise]);
          } catch (error) {
            if (error instanceof Error && error.message === "请求超时") {
              return 999;
            }
            throw error;
          }
        };

        try {
          // 0 表示本次测量无效（拿不到性能条目），999 表示超时
          const measured = [await singlePing(true), await singlePing()];
          if (measured.some((delay) => delay <= 0 || delay >= 999)) {
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
          if (error instanceof Error) {
            showErrorToast(error.message);
          } else {
            showErrorToast("节点延迟测量失败");
          }

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

          const batchSize = 10;
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

      needShowReget: false,

      showNodeListModal: false,
      setNodeListModal: () => {
        const state = get();
        const currentShow = state.showNodeListModal;
        const updates: Partial<ILoginStateSlice> = {
          showNodeListModal: !currentShow,
        };
        if (currentShow && state.needShowReget) {
          updates.showRegetModal = true;
          updates.needShowReget = false;
        }
        set(updates);
        if (!currentShow) {
          get().getNodeList();
        }
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

      getRoomData: async (auto: boolean = true) => {
        try {
          // 冷却逻辑不变
          if (!auto) {
            if (get().disableFlush) return;
            set({ disableFlush: true });
            setTimeout(() => set({ disableFlush: false }), 3000);
          }

          set({ rotate: true });

          // code === -1（客户端数据异常）由 request 统一处理：刷新页面并抛错
          const data = await api.getRoom();

          // --- 核心优化开始 ---

          // 1. 解构后端返回的完整数据
          const isOnline = (data?.is_online ?? false) as boolean;
          const incomingUserWgInfo = data?.user_wg_info; // 后端返回的完整节点信息
          const nodeNetLoad = data?.node_net_load;
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
            );

            if (get().isOnline && delay === 0) {
              openToast({
                content: "检测延迟故障，请联系服主处理",
                status: "error",
              });
            } else {
              if (!auto) openToast({ content: "刷新成功", status: "success" });
            }
            set({ latency: delay });
          } else {
            set({ latency: undefined });
            if (!auto) {
              openToast({
                content: "刷新成功，你的WG未连接",
                status: "warning",
              });
            }
          }

          // --- 核心优化结束 ---
        } catch (error) {
          // 凭证失效 / 数据异常已由统一处理接管，这里不再重复提示
          if (shouldSilenceError(error)) return;

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
    openToast({ content: "登陆凭证失效", status: "warning" });
    lastAuthToastTime = now;
  }
});
