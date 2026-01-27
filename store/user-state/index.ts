import { produce } from "immer";
import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";
import { v4 as uuidv4 } from "uuid";
import { getAuthToken, clearAuthToken } from "../authKey";
import { openToast } from "@/components/universal/toast";

interface GroupItem {
  name: string;
  qq: number;
}

interface AnnouncementItem {
  timestamp: number;
  content: string;
}
interface ServerData {
  viewCount: number | null;
  userCount: number | null;
  relateGroup: GroupItem[] | null;
  announcements: AnnouncementItem[] | null;
}
// 登录后的用户数据及wireguard信息
interface WGData {
  node_alias: string;
  ip: string;
  last_connect_timestamp: number;
  release_days: number;
  conf_text: string;
}
interface UserInfo {
  uid: number;
  username: string;
  tel: string;
  email: string;
  qq: string;
  sponsorship: number;
  wg_data: WGData | null;
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
  room_passwd: string;
}
// 登录后，拉取的节点信息
export interface NodeInfo {
  alias: string;
  bandwidth: number;
  net: number | null;
  net_type: string;
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
  getConfKey: () => void;

  // 获取隧道
  getTunnel: () => void;

  // 是否下次登录跳转到教程问答区
  goToIssues: boolean;
  setGoToIssues: (state: boolean) => void;

  // 登录加载状态
  loginLoading: boolean;
  // 获取用户信息
  userInfo: UserInfo | undefined;
  getUserInfo: () => Promise<void>;
  // 退出登录
  logout: () => void;

  // 获取节点延迟
  getNodeLatency: (
    node_alias: string,
    ping_host: string,
    net?: number | null,
  ) => Promise<number>;
  // 节点列表
  nodeMap: Map<string, NodeInfo>;
  getNodeList: () => Promise<void>;
  nodeReady: boolean;
  setNodeReady: (ready: boolean) => void;

  needShowReget: boolean;
  setNeedShowReget: () => void;

  // 节点选择
  showNodeListModal: boolean;
  setNodeListModal: () => void;
  selectNode: (node_alias: string, manual: boolean) => void;
  selectNodeLock: boolean;

  pingHost: string | undefined;
  tunnelName: string | undefined;
  latency: number | undefined;
  onlineStatus: "在线" | "离线";

  // 刷新房间信息冷却
  disableFlush: boolean;
  // 房间角色
  roomRole: "none" | "member" | "hoster";
  // 加载动画
  rotate: boolean;
  // 房间数据
  roomData: RoomInfo | undefined;
  setRoomData: (roomData: RoomInfo | undefined) => void;
  getRoomData: (manual?: boolean) => Promise<void>;

  showRegetModal: boolean;
  setShowRegetModal: () => void;

  showLoginModal: boolean;
  setShowLoginModal: () => void;
}

export const useUserStateStore = createWithEqualityFn<ILoginStateSlice>(
  (set, get) => {
    return {
      // 访问唯一标识
      uuid: "",

      // 网站访问数据和关联群
      serverData: undefined,
      getServerData: async () => {
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL;
          const resp = await fetch(`${apiUrl}/serverData`);
          if (!resp.ok) {
            throw new Error("请求出错");
          }
          const data = await resp.json();
          set(
            produce((draft) => {
              draft.serverData = data;
            }),
          );
        } catch (error) {
        } finally {
        }
      },

      // 用于导入隧道的key
      confKey: null,
      getConfKey: async () => {
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL;
          const resp = await fetch(`${apiUrl}/getDownloadConfkey`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${getAuthToken()}`,
            },
          });

          if (!resp.ok) {
            throw new Error("请求出错");
          }
          const data = await resp.json();
          if (data.code === 0) {
            set(
              produce((draft) => {
                draft.confKey = data.key;
              }),
            );
          } else {
            openToast({ content: data.msg, status: "warning" });
          }
        } catch (error) {
          openToast({ content: "服务异常，请联系服主处理", status: "error" });
        } finally {
        }
      },

      // 获取隧道
      getTunnel: async () => {
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL;
          const resp = await fetch(`${apiUrl}/getIp`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${getAuthToken()}`,
            },
          });

          if (!resp.ok) {
            throw new Error("请求出错");
          }
          const data = await resp.json();
          if (data.code === 0) {
            // 更新用户信息
            set(
              produce((draft) => {
                draft.userInfo.wg_data = data.wg_data;
              }),
            );

            openToast({
              content: `隧道${data.wg_data.ip}绑定成功`,
              status: "success",
            });

            // 获取隧道后弹出节点选择框
            if (data.wg_data) {
              get().setNodeListModal();
            }
            if (data.reget_ip) {
              get().setNeedShowReget();
            }
          } else {
            openToast({ content: data.msg, status: "warning" });
            window.location.reload();
          }
        } catch (error) {
          openToast({ content: "服务异常，请联系服主处理", status: "error" });
        } finally {
        }
      },

      // 是否下次登录跳转到教程问答区
      goToIssues: false,
      setGoToIssues: (goToIssues: boolean) => {
        set(
          produce((draft) => {
            draft.goToIssues = goToIssues;
          }),
        );
      },

      // 登录加载状态
      loginLoading: true,
      // 获取用户信息
      userInfo: undefined,
      getUserInfo: async () => {
        set(
          produce((draft) => {
            draft.loginLoading = true;
          }),
        );

        // 生成，记录uuid
        const _uuid = localStorage.getItem("uuid");
        if (_uuid) {
          set(
            produce((draft) => {
              draft.uuid = _uuid;
            }),
          );
        } else {
          set(
            produce((draft) => {
              draft.uuid = uuidv4();
              localStorage.setItem("uuid", draft.uuid);
            }),
          );
        }

        if (getAuthToken()) {
          try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            const resp = await fetch(`${apiUrl}/userInfo`, {
              method: "GET",
              headers: {
                Authorization: `Bearer ${getAuthToken()}`,
              },
            });
            if (resp.status === 401) {
              get().logout();
              throw new Error("登陆凭证失效");
            }
            if (!resp.ok) {
              throw new Error("服务器出错，请稍后再试");
            }
            const data = await resp.json();
            const userInfo: UserInfo = data.data;
            set(
              produce((draft) => {
                draft.userInfo = userInfo;
              }),
            );
            // 如果有隧道信息就拉节点列表
            if (userInfo.wg_data) {
              // 如果没选节点就弹出节点列表
              if (!userInfo.wg_data.node_alias) get().setNodeListModal();
              else get().selectNode(userInfo.wg_data.node_alias, false);
            }
          } catch (error) {
            if (error instanceof Error) {
              if (error.message === "登陆凭证失效") {
                openToast({
                  content: "登陆凭证失效",
                  status: "warning",
                });
              } else {
                openToast({
                  content: error.message,
                  status: "error",
                });
              }
            } else {
              openToast({
                content: "服务器出错，请稍后再试",
                status: "error",
              });
            }
          } finally {
          }
        }

        set(
          produce((draft) => {
            draft.loginLoading = false;
          }),
        );
      },

      // 退出登录
      logout: () => {
        clearAuthToken();

        set(
          produce((draft) => {
            draft.uuid = uuidv4();
            localStorage.setItem("uuid", draft.uuid);
            draft.userInfo = undefined;
            draft.roomRole = "none";
            draft.roomData = undefined;
            draft.latency = undefined;
          }),
        );
      },

      // 获取节点延迟
      getNodeLatency: async (
        node_alias: string,
        ping_host: string,
        net: number | null = 0,
      ) => {
        if (net === null) return 0;

        const statusUrl = `https://${ping_host}/ping`;
        const node = get().nodeMap.get(node_alias);
        // console.debug(node);
        // 单次ping请求的辅助函数
        const singlePing = async (): Promise<number> => {
          try {
            // 999ms超时处理
            const timeoutPromise = new Promise<number>((_, reject) => {
              setTimeout(() => reject(new Error("请求超时")), 999);
            });

            const pingPromise = (async () => {
              const resp = await fetch(statusUrl);
              if (!resp.ok) {
                throw new Error(`${node_alias}节点获取延迟出错`);
              }
              // 等待一小段时间确保 performance 记录了请求
              await new Promise((resolve) => setTimeout(resolve, 100));

              const entries = performance.getEntriesByName(statusUrl);
              const lastEntry = entries.at(-1) as
                | PerformanceResourceTiming
                | undefined;

              if (lastEntry) {
                const delay = Math.floor(
                  lastEntry.responseStart - lastEntry.requestStart,
                );
                // 确保延迟不超过999ms
                return Math.min(delay, 999);
              } else {
                throw new Error(`${node_alias}节点获取延迟性能记录出错`);
              }
            })();

            return await Promise.race([pingPromise, timeoutPromise]);
          } catch (error) {
            if (error instanceof Error && error.message === "请求超时") {
              // 超时返回999ms
              return 999;
            }
            throw error;
          }
        };

        try {
          // 连续串行请求两次
          // const delay1 = await singlePing();
          // const delay2 = await singlePing();
          // 并行请求两次
          const [delay1, delay2] = await Promise.all([
            singlePing(),
            singlePing(),
          ]);
          // 选择最低延迟
          const minDelay = Math.min(delay1, delay2);

          if (node) {
            set(
              produce((draft) => {
                node.delay = minDelay;
                const newMap = new Map(get().nodeMap);
                // 合并旧数据和新数据
                newMap.set(node_alias, node);
                draft.nodeMap = newMap;
              }),
            );
          }
          return minDelay;
        } catch (error) {
          if (error instanceof Error) {
            if (error.message === "Failed to fetch") {
              openToast({
                content: "未知错误A",
                status: "error",
              });
            } else {
              openToast({
                content: error.message,
                status: "error",
              });
            }
          } else {
            openToast({
              content: "未知错误B",
              status: "error",
            });
          }

          if (node) {
            set(
              produce((draft) => {
                node.delay = 0;
                const newMap = new Map(get().nodeMap);
                // 合并旧数据和新数据
                newMap.set(node_alias, node);
                draft.nodeMap = newMap;
              }),
            );
          }
          return 0;
        }
      },

      // 节点列表
      nodeMap: new Map<string, any>(),

      getNodeList: async () => {
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL;
          const resp = await fetch(`${apiUrl}/nodeList`);
          if (!resp.ok) {
            throw new Error("请求出错");
          }
          // 返回的没有 delay
          const nodes: NodeInfo[] = await resp.json();

          set(
            produce((draft) => {
              draft.nodeMap = new Map<string, NodeInfo>(
                nodes.map((n) => [n.alias, n]),
              );
            }),
          );

          // 并行请求所有节点的延迟
          const latencyPromises = nodes.map((node) =>
            get().getNodeLatency(node.alias, node.ping_host, node.net),
          );

          // 等待所有请求完成，返回结果数组
          await Promise.all(latencyPromises);
        } catch (error) {
          openToast({
            content: "节点列表刷新失败",
            status: "error",
          });
        } finally {
          get().setNodeReady(true);
          openToast({
            content: "节点列表已刷新",
            status: "success",
          });
          performance.clearResourceTimings();
        }
      },
      nodeReady: false,
      setNodeReady: (ready: boolean) => {
        set(
          produce((draft) => {
            draft.nodeReady = ready;
          }),
        );
      },

      // 是否需要显示重新导入弹窗
      needShowReget: false,
      setNeedShowReget: () => {
        set(
          produce((draft) => {
            draft.needShowReget = !draft.needShowReget;
          }),
        );
      },

      // 节点选择
      showNodeListModal: false,
      setNodeListModal: () => {
        set(
          produce((draft) => {
            // 如果窗口就是打开并获取了新隧道就弹出提示
            if (draft.showNodeListModal && draft.needShowReget) {
              draft.showRegetModal = true;
              draft.needShowReget = false;
            }
            // 如果窗口打开了就刷新节点列表
            if (!draft.showNodeListModal) {
              get().getNodeList();
            }
            draft.showNodeListModal = !draft.showNodeListModal;
          }),
        );
      },
      selectNodeLock: false,
      selectNode: async (node_alias: string, manual: boolean) => {
        try {
          set(
            produce((draft) => {
              draft.selectNodeLock = true;
            }),
          );
          const apiUrl = process.env.NEXT_PUBLIC_API_URL;
          const params = manual ? `?node_alias=${node_alias}` : ``;
          const resp = await fetch(`${apiUrl}/selectNode` + params, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${getAuthToken()}`,
            },
          });

          if (!resp.ok) {
            throw new Error("请求出错");
          }
          const data = await resp.json();
          if (data.code === 0) {
            set(
              produce((draft) => {
                if (draft?.userInfo?.wg_data) {
                  // 更新用户选择的节点
                  draft.userInfo.wg_data.node_alias = node_alias;
                  draft.tunnelName = data.tunnel_name;
                  draft.pingHost = data.ping_host;
                  draft.userInfo.wg_data.conf_text = data.conf_text;
                }
              }),
            );
            //手动选择的才弹窗
            if (manual) openToast({ content: data.msg, status: "success" });
          } else {
            openToast({ content: data.msg, status: "warning" });
          }
        } catch (error) {
          openToast({ content: "服务异常，请联系服主处理", status: "error" });
        } finally {
          set(
            produce((draft) => {
              draft.selectNodeLock = false;
            }),
          );
        }
      },

      pingHost: undefined,
      tunnelName: undefined,
      latency: undefined,
      onlineStatus: "离线",

      // 刷新房间信息冷却
      disableFlush: false,
      // 房间角色
      roomRole: "none",
      // 加载动画
      rotate: false,
      // 房间数据
      roomData: undefined,
      setRoomData: (roomData: RoomInfo | undefined) => {
        set(
          produce((draft) => {
            draft.roomData = roomData;
          }),
        );
      },
      getRoomData: async (passLock: boolean = true) => {
        try {
          if (!passLock) {
            if (get().disableFlush === true) return;

            // 设置定时器，3秒后重新启用按钮
            set(
              produce((draft) => {
                draft.disableFlush = true;
              }),
            );

            setTimeout(() => {
              // 启用按钮
              set(
                produce((draft) => {
                  draft.disableFlush = false;
                }),
              );
            }, 3000);
          }

          //转起来
          set(
            produce((draft) => {
              draft.rotate = true;
            }),
          );

          const apiUrl = process.env.NEXT_PUBLIC_API_URL;
          const resp = await fetch(`${apiUrl}/getRoom`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${getAuthToken()}`,
            },
          });
          if (!resp.ok) {
            throw new Error("请求出错");
          }
          const data = await resp.json();

          // ip失效刷新页面
          if (data.code === -1) window.location.reload();

          const is_online = data.is_online as boolean;
          // 在线状态
          set(
            produce((draft) => {
              draft.onlineStatus = is_online ? "在线" : "离线";
            }),
          );
          const node_alias = get().userInfo?.wg_data?.node_alias;
          const pingHost = get().pingHost;

          if (is_online && pingHost && node_alias) {
            if (pingHost) {
              const delay = await get().getNodeLatency(node_alias, pingHost);

              if (get().onlineStatus === "在线" && delay === 0)
                openToast({
                  content: "检测延迟故障，请联系服主处理",
                  status: "error",
                });

              set(
                produce((draft) => {
                  draft.latency = delay;
                }),
              );
            }
          } else {
            set(
              produce((draft) => {
                draft.latency = undefined;
              }),
            );
            openToast({
              content: "离线无法联机，不会用就看联机教程",
              status: "warning",
            });
          }

          const roomData = data.data as RoomInfo;

          let roomRole: string = "none";
          if (roomData) {
            roomRole =
              roomData.user_ip === roomData.hoster_ip ? "hoster" : "member";
          }
          set(
            produce((draft) => {
              draft.roomRole = roomRole;
            }),
          );

          get().setRoomData(roomData);

          openToast({ content: `刷新成功`, status: "success" });
        } catch (error) {
          openToast({
            content: "出错！不要使用百度浏览器",
            status: "error",
          });
        } finally {
          set(
            produce((draft) => {
              draft.rotate = false;
            }),
          );
        }
      },

      showRegetModal: false,
      setShowRegetModal: () => {
        set(
          produce((draft) => {
            draft.showRegetModal = !draft.showRegetModal;
          }),
        );
      },

      showLoginModal: false,

      setShowLoginModal: () => {
        set(
          produce((draft) => {
            draft.showLoginModal = !draft.showLoginModal;
          }),
        );
      },
    };
  },
  shallow,
);
