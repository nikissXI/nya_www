import { produce, enableMapSet } from "immer";

enableMapSet();
import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";
import { v4 as uuidv4 } from "uuid";
import { getAuthToken, clearAuthToken } from "../authKey";
import { openToast } from "@/components/universal/toast";
import { apiUrl } from "@/utils/api";

interface GroupItem {
  name: string;
  qq: number;
}

interface AnnouncementItem {
  timestamp: number;
  content: string;
}
interface ServerData {
  viewCount: number;
  userCount: number;
  relateGroup: GroupItem[];
  carouselMsg: string[];
  announcements: AnnouncementItem[];
}
interface UserInfo {
  uid: number;
  username: string;
  tel: string;
  email: string;
  qq: string;
  sponsorship: number;
}

interface UserWgInfo {
  node_alias: string;
  tunnel_name: string;
  conf_text: string;
  ping_host: string;
  user_ip: string;
  net_type: string;
  bandwidth: number;
}

// 登录后，用户访问房间列表拉取的房间信息
interface Member {
  username: string;
  ip: string;
  status: "在线" | "离线";
  sponsorship: number;
}
interface RoomInfo {
  room_id: number;
  user_ip: string;
  hoster_ip: string;
  members: Member[];
  room_max: number;
  room_passwd: string;
}
// 登录后，拉取的节点信息
export interface NodeInfo {
  alias: string;
  bandwidth: number;
  net: number;
  net_type: string;
  node_desc: string;
  ping_host: string;
  sponsor: boolean;
  delay: number;
}

interface ILoginStateSlice {
  // 访问唯一标识
  uuid: string;

  // 网站访问数据和关联群
  serverData: ServerData | undefined;
  getServerData: () => Promise<void>;

  // 用于导入隧道的key
  confKey: string | null;
  getConfKey: (manual?: boolean) => void;

  // 是否下次登录跳转到教程问答区
  goToDoc: boolean;
  setGoToDoc: (state: boolean) => void;

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
  nodeNetLoad: number;
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
  setShowLoginModal: () => void;

  showOfflineReasonsModal: boolean;
  setOfflineReasonsModal: () => void;
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

      serverData: undefined,
      getServerData: async () => {
        try {
          const resp = await fetch(`${apiUrl}/serverData`);
          if (!resp.ok) throw new Error("请求出错");
          const data = await resp.json();
          set({ serverData: data });
        } catch (error) {
          // 静默失败，不影响使用
          console.warn("获取服务数据失败", error);
        }
      },

      confKey: null,
      getConfKey: async (manual: boolean = false) => {
        try {
          const resp = await fetch(`${apiUrl}/getDownloadConfkey`, {
            method: "GET",
            headers: { Authorization: `Bearer ${getAuthToken()}` },
          });
          if (!resp.ok) throw new Error("请求出错");
          const data = await resp.json();
          if (data.code === 0) {
            set({ confKey: data.key });
            if (manual)
              openToast({ content: "key激活成功", status: "success" });
          } else {
            openToast({ content: data.msg, status: "warning" });
          }
        } catch (error) {
          // 改动：不再 reload，而是提示用户重新登录
          openToast({
            content: "获取配置失败，请尝试重新登录",
            status: "error",
          });
        }
      },

      goToDoc: false,
      setGoToDoc: (goToDocValue: boolean) => set({ goToDoc: goToDocValue }),

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

        if (getAuthToken()) {
          try {
            const resp = await fetch(`${apiUrl}/userInfo`, {
              method: "GET",
              headers: { Authorization: `Bearer ${getAuthToken()}` },
            });
            if (resp.status === 401) {
              get().logout();
              throw new Error("登陆凭证失效");
            }
            if (!resp.ok) throw new Error("服务器出错，请稍后再试");
            const data = await resp.json();

            if (data.reget_ip) {
              set({ needShowReget: true });
            }

            const userInfo: UserInfo = data.user_info;
            set({ userInfo });

            if (data.user_wg_info) {
              const userWgInfo: UserWgInfo = data.user_wg_info;
              set({ userWgInfo });
            } else {
              get().setNodeListModal();
            }
          } catch (error) {
            if (error instanceof Error) {
              if (error.message === "登陆凭证失效") {
                openToast({ content: "登陆凭证失效", status: "warning" });
              } else {
                openToast({ content: error.message, status: "error" });
              }
            } else {
              openToast({ content: "服务器出错，请稍后再试", status: "error" });
            }
          } finally {
            // 改动：确保在 finally 中重置加载状态
            set({ loginLoading: false });
          }
        } else {
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
          nodeNetLoad: -1,
        });
        localStorage.setItem("uuid", new_uuid);
      },

      // 改动：增加清理性能条目的逻辑，避免旧条目干扰
      getNodeLatency: async (
        node_alias: string,
        ping_host: string,
        net: number | null = 0,
      ) => {
        if (net === null) return 0;

        const statusUrl = `https://${ping_host}/ping`;
        // 清除该 URL 的旧条目，确保获取最新
        performance.clearResourceTimings();

        const singlePing = async (first: boolean = false): Promise<number> => {
          try {
            const timeout = first ? 3000 : 1000;
            const timeoutPromise = new Promise<number>((_, reject) =>
              setTimeout(() => reject(new Error("请求超时")), timeout),
            );

            const pingPromise = (async () => {
              const resp = await fetch(statusUrl);
              if (!resp.ok) {
                throw new Error(`${node_alias}节点获取延迟出错`);
              }
              await new Promise((resolve) => setTimeout(resolve, 100));

              const entries = performance.getEntriesByName(statusUrl);
              const lastEntry = entries.at(-1) as
                | PerformanceResourceTiming
                | undefined;
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
          const delay1 = await singlePing(true);
          const delay2 = await singlePing();
          let minDelay = Math.min(delay1, delay2);

          if (minDelay === 0 || minDelay === 999) {
            const retryDelay = await singlePing();
            minDelay = Math.min(minDelay, retryDelay);
          }

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
      nodeMap: new Map<string, any>(),
      fixedNode: undefined,
      getNodeList: async () => {
        if (get().getNodeListLock) return;
        set({ getNodeListLock: true });

        const nowUserWgInfo = get().userWgInfo;
        if (nowUserWgInfo) {
          set({ fixedNode: nowUserWgInfo.node_alias });
        }

        try {
          const resp = await fetch(`${apiUrl}/nodeList`);
          if (!resp.ok) throw new Error("请求出错");
          const nodes: NodeInfo[] = await resp.json();

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

          const resp = await fetch(
            `${apiUrl}/selectNode?node_alias=${node_alias}`,
            {
              method: "GET",
              headers: { Authorization: `Bearer ${getAuthToken()}` },
            },
          );
          if (!resp.ok) throw new Error("请求出错");
          const data = await resp.json();
          if (data.code === 0) {
            const userWgInfo: UserWgInfo = data.user_wg_info;
            set({
              userWgInfo,
              roomData: undefined, // 切换节点后清空房间数据，触发重新获取
            });
            openToast({ content: data.msg, status: "success" });
          } else {
            openToast({ content: data.msg, status: "warning" });
          }
        } catch (error) {
          // 改动：不刷新页面，提示错误
          openToast({ content: "节点切换失败，请重试", status: "error" });
        } finally {
          set({ selectNodeLock: false });
        }
      },

      latency: undefined,
      nodeNetLoad: -1,
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

          const resp = await fetch(`${apiUrl}/getRoom`, {
            method: "GET",
            headers: { Authorization: `Bearer ${getAuthToken()}` },
          });
          if (!resp.ok) throw new Error("请求出错");

          const data = await resp.json();
          if (data.code === -1) window.location.reload();

          // --- 核心优化开始 ---

          // 1. 解构后端返回的完整数据
          const isOnline = data.is_online as boolean;
          const roomData = data.data as RoomInfo;
          const incomingUserWgInfo = data.user_wg_info; // 后端返回的完整节点信息
          const nodeNetLoad = data.node_net_load;

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
                content: "离线无法联机，不会用就看联机教程",
                status: "warning",
              });
            }
          }

          // --- 核心优化结束 ---
        } catch (error) {
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
      setShowLoginModal: () => {
        set({ showLoginModal: !get().showLoginModal });
      },

      showOfflineReasonsModal: false,
      setOfflineReasonsModal: () => {
        set({ showOfflineReasonsModal: !get().showOfflineReasonsModal });
      },
    };
  },
  shallow,
);
