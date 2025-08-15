import { produce } from "immer";
import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";
import { v4 as uuidv4 } from "uuid";
import { getAuthToken, clearAuthToken } from "../authKey";
import { openToast } from "@/components/universal/toast";
import { User } from "@sentry/react";

interface GroupItem {
  name: string;
  qq: number;
}
interface ServerData {
  viewCount: number | null;
  userCount: number | null;
  relateGroup: GroupItem[] | null;
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
interface NodeInfo {
  alias: string;
  ping_host: string;
  sponsor: boolean;
  net: number | null;
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
    net?: number | null
  ) => Promise<number>;
  // 节点列表
  nodeMap: Map<string, NodeInfo>;
  getNodeList: () => Promise<void>;

  // 节点选择
  showNodeListModal: boolean;
  setNodeListModal: () => void;
  selectNode: (node_alias: string, manual: boolean) => void;
  selectNodeLock: boolean;

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
            })
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
              })
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
              })
            );

            openToast({
              content: `隧道${data.ip}绑定成功`,
              status: "success",
            });

            // 获取隧道后弹出节点选择框
            if (data.data.wg_data) {
              get().setNodeListModal();
              get().getNodeList();
            }
            if (data.reget_ip) {
              get().setShowRegetModal();
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
          })
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
          })
        );

        // 生成，记录uuid
        const _uuid = localStorage.getItem("uuid");
        if (_uuid) {
          set(
            produce((draft) => {
              draft.uuid = _uuid;
            })
          );
        } else {
          set(
            produce((draft) => {
              draft.uuid = uuidv4();
              localStorage.setItem("uuid", draft.uuid);
            })
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
              })
            );
            // 如果有隧道信息就拉节点列表
            if (userInfo.wg_data) {
              get().getNodeList();
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
          })
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
          })
        );
      },

      // 获取节点延迟
      getNodeLatency: async (
        node_alias: string,
        ping_host: string,
        net: number | null = 0
      ) => {
        if (net === null) return 0;

        const statusUrl = `https://${ping_host}/ping`;
        const node = get().nodeMap.get(node_alias);

        try {
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
              lastEntry.responseStart - lastEntry.requestStart
            );
            if (node) node.delay = delay;
            return delay;
          } else {
            openToast({
              content: `${node_alias}节点获取延迟出错，联系服主处理`,
              status: "error",
            });
            if (node) node.delay = 0;
            return 0;
          }
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

          if (node) node.delay = 0;
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

          get().nodeMap = new Map<string, NodeInfo>(
            nodes.map((n) => [n.alias, n])
          );

          // get().nodeMap.forEach((node, key) => {
          //   console.log(key, node);
          // });

          // 并行请求所有节点的延迟
          const latencyPromises = nodes.map((node) =>
            get().getNodeLatency(node.alias, node.ping_host, node.net)
          );
          // 等待所有请求完成，返回结果数组
          const nodesWithDelay = await Promise.all(latencyPromises);

          set(
            produce((draft) => {
              draft.nodeList = nodesWithDelay;
            })
          );
        } catch (error) {
          openToast({
            content: "拉取节点列表出错",
            status: "error",
          });
        } finally {
        }
      },

      // 节点选择
      showNodeListModal: false,
      setNodeListModal: () => {
        set(
          produce((draft) => {
            draft.showNodeListModal = !draft.showNodeListModal;
          })
        );
      },
      selectNodeLock: false,
      selectNode: async (node_alias: string, manual: boolean) => {
        try {
          set(
            produce((draft) => {
              draft.selectNodeLock = true;
            })
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
                  draft.userInfo.wg_data.conf_text = data.conf_text;
                }
              })
            );

            openToast({ content: data.msg, status: "success" });
          } else {
            openToast({ content: data.msg, status: "warning" });
          }
        } catch (error) {
          openToast({ content: "服务异常，请联系服主处理", status: "error" });
        } finally {
          set(
            produce((draft) => {
              draft.selectNodeLock = false;
            })
          );
        }
      },

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
          })
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
              })
            );

            setTimeout(() => {
              // 启用按钮
              set(
                produce((draft) => {
                  draft.disableFlush = false;
                })
              );
            }, 3000);
          }

          //转起来
          set(
            produce((draft) => {
              draft.rotate = true;
            })
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
            })
          );
          const node_alias = get().userInfo?.wg_data?.node_alias;

          if (is_online && node_alias) {
            const node = get().nodeMap.get(node_alias);

            if (get().latency === undefined) {
              performance.clearResourceTimings();
            }

            if (node?.ping_host) {
              const delay = await get().getNodeLatency(
                node_alias,
                node.ping_host
              );

              if (get().onlineStatus === "在线" && delay === 0)
                openToast({
                  content: "检测延迟故障，请联系服主处理",
                  status: "error",
                });

              set(
                produce((draft) => {
                  draft.latency = delay;
                })
              );
            }
          } else {
            set(
              produce((draft) => {
                draft.latency = 0;
              })
            );
            openToast({
              content: "离线无法联机，不会用就看使用教程",
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
            })
          );

          get().setRoomData(roomData);

          openToast({ content: `刷新成功`, status: "success" });
        } catch (error) {
          openToast({
            content: "服务器出错，请稍后刷新再试",
            status: "error",
          });
        } finally {
          set(
            produce((draft) => {
              draft.rotate = false;
            })
          );
        }
      },

      showRegetModal: false,
      setShowRegetModal: () => {
        set(
          produce((draft) => {
            draft.showRegetModal = !draft.showRegetModal;
          })
        );
      },

      showLoginModal: false,

      setShowLoginModal: () => {
        set(
          produce((draft) => {
            draft.showLoginModal = !draft.showLoginModal;
          })
        );
      },
    };
  },
  shallow
);
