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
interface ServerData {
  viewCount: number | null;
  userCount: number | null;
  relateGroup: GroupItem[] | null;
}
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

interface NodeInfo {
  alias: string;
  endpoint: string;
  sponsor: boolean;
  net: number | null;
  delay: number;
}

interface ILoginStateSlice {
  serverData: ServerData | undefined;
  getServerData: () => Promise<void>;
  setServerData: (serverData: ServerData) => void;

  uuid: string;

  confKey: string | null;
  getConfKey: () => void;

  getIp: () => void;

  logging: boolean;
  changeloggingState: (state: boolean) => void;

  logined: boolean;
  changeLoginState: (state: boolean) => void;

  goToDoc: boolean;
  changeGoToDocState: (state: boolean) => void;

  getUserInfo: () => Promise<void>;

  logout: () => void;

  userInfo: UserInfo | undefined;
  setUserInfo: (profile: UserInfo | undefined) => void;

  roomStatus: "none" | "member" | "hoster";
  setRoomStatus: (roomStatus: "none" | "member" | "hoster") => void;

  disableFlush: boolean;
  setDisableFlush: (disable: boolean) => void;

  roomData: RoomInfo | undefined;
  getRoomData: (manual?: boolean) => Promise<void>;
  setRoomData: (roomData: RoomInfo | undefined) => void;

  nodeList: NodeInfo[] | undefined;
  getNodeList: () => Promise<void>;

  showNodeListModal: boolean;
  setNodeListModal: () => void;

  firstLoad: boolean;
  selectNode: (node_alias: string, manual?: boolean) => void;
  selectNodeLock: boolean;
  setSelectNodeLock: (lock: boolean) => void;

  tunnelName: string | undefined;
  selectedEndpoint: string | undefined;

  latency: number | undefined;
  getLatency: (
    node_alias: string,
    endpoint: string,
    first?: boolean
  ) => Promise<void>;
  setLatency: (latency: number | undefined) => void;

  rotate: boolean;
  setRotate: (rotate: boolean) => void;

  onlineStatus: "在线" | "离线";
  setOnlineStatus: (onlineStatus: "在线" | "离线") => void;

  showRegetModal: boolean;
  setShowRegetModal: () => void;

  showSponsorModal: boolean;
  setShowSponsorModal: () => void;

  showLoginModal: boolean;
  setShowLoginModal: () => void;
}

async function getNodeLatency(
  node_alias: string,
  endpoint: string,
  sponsor: boolean,
  net: number | null
): Promise<NodeInfo> {
  if (net === null)
    return {
      alias: node_alias,
      endpoint: endpoint,
      sponsor: sponsor,
      net: net,
      delay: 0,
    };

  const statusUrl = `https://${endpoint}/ping`;

  try {
    const resp = await fetch(statusUrl);
    if (!resp.ok) {
      throw new Error(`${node_alias}节点获取延迟出错`);
    }
    // 等待一小段时间确保 performance 记录了请求
    await new Promise((resolve) => setTimeout(resolve, 100));

    const entries = performance.getEntriesByName(statusUrl);
    const lastEntry = entries.at(-1) as PerformanceResourceTiming | undefined;

    if (lastEntry) {
      const delay = Math.floor(
        lastEntry.responseStart - lastEntry.requestStart
      );
      return {
        alias: node_alias,
        endpoint: endpoint,
        sponsor: sponsor,
        net: net,
        delay: delay,
      };
    } else {
      openToast({
        content: `${node_alias}节点获取延迟出错，联系服主处理`,
        status: "error",
      });
      return {
        alias: node_alias,
        endpoint: endpoint,
        sponsor: sponsor,
        net: net,
        delay: 0,
      };
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
    return {
      alias: node_alias,
      endpoint: endpoint,
      sponsor: sponsor,
      net: net,
      delay: 0,
    };
  }
}

export const useUserStateStore = createWithEqualityFn<ILoginStateSlice>(
  (set, get) => {
    return {
      serverData: undefined,

      getServerData: async () => {
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL;
          const resp = await fetch(`${apiUrl}/serverData`);
          if (!resp.ok) {
            throw new Error("请求出错");
          }
          const data = await resp.json();
          get().setServerData(data);
        } catch (error) {
        } finally {
        }
      },

      // setServerData: (serverData: ServerData) => {
      //   set((state) => {
      //     return produce(state, (draft) => {
      //       draft.serverData = serverData;
      //     });
      //   });
      // },

      // 更优写法（推荐）
      setServerData: (serverData: ServerData) =>
        set(
          produce((draft) => {
            draft.serverData = serverData;
          })
        ),

      uuid: "",

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
            // set((state) => {
            //   return produce(state, (draft) => {
            //     draft.confKey = data.key;
            //   });
            // });
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

      getIp: async () => {
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
            openToast({
              content: `隧道${data.ip}绑定成功`,
              status: "success",
            });
            get().getUserInfo();

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

      logging: true,
      changeloggingState: (loggingState: boolean) => {
        // set((state) => {
        //   return produce(state, (draft) => {
        //     draft.logging = loggingState;
        //   });
        // });
        set(
          produce((draft) => {
            draft.logging = loggingState;
          })
        );
      },

      logined: false,
      changeLoginState: (loginState: boolean) => {
        // set((state) => {
        //   return produce(state, (draft) => {
        //     draft.logined = loginState;
        //   });
        // });
        set(
          produce((draft) => {
            draft.logined = loginState;
          })
        );
      },

      goToDoc: false,
      changeGoToDocState: (goToDocState: boolean) => {
        // set((state) => {
        //   return produce(state, (draft) => {
        //     draft.goToDoc = goToDocState;
        //   });
        // });
        set(
          produce((draft) => {
            draft.goToDoc = goToDocState;
          })
        );
      },

      getUserInfo: async () => {
        // set((state) => {
        //   return produce(state, (draft) => {
        //     draft.logging = true;
        //   });
        // });

        set(
          produce((draft) => {
            draft.logging = true;
          })
        );

        const _uuid = localStorage.getItem("uuid");
        if (_uuid) {
          // set((state) => {
          //   return produce(state, (draft) => {
          //     draft.uuid = _uuid;
          //   });
          // });
          set(
            produce((draft) => {
              draft.uuid = _uuid;
            })
          );
        } else {
          // set((state) => {
          //   return produce(state, (draft) => {
          //     draft.uuid = uuidv4();
          //     localStorage.setItem("uuid", draft.uuid);
          //   });
          // });
          set(
            produce((draft) => {
              draft.uuid = uuidv4();
              localStorage.setItem("uuid", draft.uuid);
            })
          );
        }

        const token = getAuthToken();

        if (token) {
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
            get().setUserInfo(data.data);
            get().changeLoginState(true);
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

        // set((state) => {
        //   return produce(state, (draft) => {
        //     draft.logging = false;
        //   });
        // });
        set(
          produce((draft) => {
            draft.logging = false;
          })
        );
      },

      logout: () => {
        clearAuthToken();
        // set((state) => {
        //   return produce(state, (draft) => {
        //     draft.uuid = uuidv4();
        //     localStorage.setItem("uuid", draft.uuid);
        //   });
        // });
        set(
          produce((draft) => {
            draft.uuid = uuidv4();
            localStorage.setItem("uuid", draft.uuid);
          })
        );
        get().setUserInfo(undefined);
        get().changeLoginState(false);
        get().setRoomStatus("none");
        get().setRoomData(undefined);
        get().setLatency(undefined);
      },

      userInfo: undefined,

      setUserInfo: (profile: UserInfo | undefined) => {
        // set((state) => {
        //   return produce(state, (draft) => {
        //     draft.userInfo = profile;
        //   });
        // });
        set(
          produce((draft) => {
            draft.userInfo = profile;
          })
        );
      },

      roomStatus: "none",

      setRoomStatus: (roomStatus: "none" | "member" | "hoster") => {
        // set((state) => {
        //   return produce(state, (draft) => {
        //     draft.roomStatus = roomStatus;
        //   });
        // });
        set(
          produce((draft) => {
            draft.roomStatus = roomStatus;
          })
        );
      },

      disableFlush: false,
      setDisableFlush: (disable: boolean) => {
        set(
          produce((draft) => {
            draft.disableFlush = disable;
          })
        );
      },

      roomData: undefined,

      getRoomData: async (passLock: boolean = true) => {
        try {
          if (!passLock) {
            if (get().disableFlush === true) return;
            get().setDisableFlush(true);
            // 设置定时器，3秒后重新启用按钮
            setTimeout(() => {
              get().setDisableFlush(false); // 启用按钮
            }, 3000);
          }

          //转起来
          get().setRotate(true);

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
          // 在线状态处理
          get().setOnlineStatus(is_online ? "在线" : "离线");

          if (is_online) {
            const node_alias = get().userInfo?.wg_data?.node_alias;
            const endpoint = get().selectedEndpoint;
            if (node_alias && endpoint) get().getLatency(node_alias, endpoint);
          } else {
            get().setLatency(0);
            openToast({
              content: "离线无法联机，不会用就看使用教程",
              status: "warning",
            });
          }

          const roomData = data.data as RoomInfo;

          // 使用局部变量进行状态判断
          if (roomData) {
            // 房主或成员
            if (roomData.user_ip === roomData.hoster_ip) {
              get().setRoomStatus("hoster");
            } else {
              get().setRoomStatus("member");
            }
          } else {
            get().setRoomStatus("none");
          }

          get().setRoomData(roomData);

          openToast({ content: `刷新成功`, status: "success" });
        } catch (error) {
          openToast({
            content: "服务器出错，请稍后刷新再试",
            status: "error",
          });
        } finally {
          get().setRotate(false);
        }
      },

      setRoomData: (roomData: RoomInfo | undefined) => {
        // set((state) => {
        //   return produce(state, (draft) => {
        //     draft.roomData = roomData;
        //   });
        // });
        set(
          produce((draft) => {
            draft.roomData = roomData;
          })
        );
      },

      nodeList: undefined,

      getNodeList: async () => {
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL;
          const resp = await fetch(`${apiUrl}/nodeList`);
          if (!resp.ok) {
            throw new Error("请求出错");
          }
          // 返回的没有 delay
          const data: NodeInfo[] = await resp.json();

          // 并行请求所有节点的延迟
          const latencyPromises = data.map((node) =>
            getNodeLatency(node.alias, node.endpoint, node.sponsor, node.net)
          );
          // 等待所有请求完成，返回结果数组
          const nodesWithDelay = await Promise.all(latencyPromises);

          // set((state) => {
          //   return produce(state, (draft) => {
          //     draft.nodeList = nodesWithDelay;
          //   });
          // });
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

      showNodeListModal: false,

      setNodeListModal: () => {
        // set((state) => {
        //   return produce(state, (draft) => {
        //     draft.showNodeListModal = !draft.showNodeListModal;
        //   });
        // });
        set(
          produce((draft) => {
            draft.showNodeListModal = !draft.showNodeListModal;
          })
        );
      },

      selectNodeLock: false,

      setSelectNodeLock: (lock: boolean) => {
        // set((state) => {
        //   return produce(state, (draft) => {
        //     draft.selectNodeLock = lock;
        //   });
        // });
        set(
          produce((draft) => {
            draft.selectNodeLock = lock;
          })
        );
      },

      firstLoad: true,

      selectNode: async (node_alias: string, manual: boolean = false) => {
        try {
          const firstLoad = get().firstLoad;
          if (firstLoad) {
            set(
              produce((draft) => {
                draft.firstLoad = false;
              })
            );
          }

          get().setSelectNodeLock(true);
          const apiUrl = process.env.NEXT_PUBLIC_API_URL;
          const params =
            firstLoad && manual === false ? `` : `?node_alias=${node_alias}`;
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
            // set((state) => {
            //   return produce(state, (draft) => {
            //     if (draft?.userInfo?.wg_data) {
            //       // 更新用户选择的节点
            //       draft.userInfo.wg_data.node_alias = node_alias;
            //       draft.tunnelName = data.tunnel_name;
            //       draft.selectedEndpoint = data.endpoint;
            //       draft.userInfo.wg_data.conf_text = data.conf_text;
            //     }
            //   });
            // });
            set(
              produce((draft) => {
                if (draft?.userInfo?.wg_data) {
                  // 更新用户选择的节点
                  draft.userInfo.wg_data.node_alias = node_alias;
                  draft.tunnelName = data.tunnel_name;
                  draft.selectedEndpoint = data.endpoint;
                  draft.userInfo.wg_data.conf_text = data.conf_text;
                }
              })
            );

            if (firstLoad)
              get().getLatency(node_alias, data.endpoint, firstLoad);

            openToast({ content: data.msg, status: "success" });
          } else {
            openToast({ content: data.msg, status: "warning" });
          }
        } catch (error) {
          openToast({ content: "服务异常，请联系服主处理", status: "error" });
        } finally {
          get().setSelectNodeLock(false);
        }
      },

      tunnelName: undefined,
      selectedEndpoint: undefined,

      latency: undefined,

      getLatency: async (
        node_alias: string,
        endpoint: string,
        first: boolean = false
      ) => {
        const nodeWithDelay = await getNodeLatency(
          node_alias,
          endpoint,
          false,
          0
        );

        if (get().onlineStatus === "在线" && nodeWithDelay.delay === 0)
          openToast({
            content: "检测延迟故障，请联系服主处理",
            status: "error",
          });

        get().setLatency(nodeWithDelay.delay);

        if (first === false) performance.clearResourceTimings();

        // 赞助提示
        if (get().userInfo?.sponsorship === 0) {
          const pingCount = localStorage.getItem("pingCount");
          if (pingCount) {
            const newPingCount = Number(pingCount) + 1;

            if (newPingCount === 88) {
              get().setShowSponsorModal();
            }

            localStorage.setItem("pingCount", newPingCount.toString());
          } else {
            localStorage.setItem("pingCount", "1");
          }
        }
      },

      setLatency: (latency: number | undefined) => {
        // set((state) => {
        //   return produce(state, (draft) => {
        //     draft.latency = latency;
        //   });
        // });
        set(
          produce((draft) => {
            draft.latency = latency;
          })
        );
      },

      rotate: false,

      setRotate: (rotate: boolean) => {
        // set((state) => {
        //   return produce(state, (draft) => {
        //     draft.rotate = rotate;
        //   });
        // });
        set(
          produce((draft) => {
            draft.rotate = rotate;
          })
        );
      },

      onlineStatus: "离线",

      setOnlineStatus: (onlineStatus: "在线" | "离线") => {
        // set((state) => {
        //   return produce(state, (draft) => {
        //     draft.onlineStatus = onlineStatus;
        //   });
        // });
        set(
          produce((draft) => {
            draft.onlineStatus = onlineStatus;
          })
        );
      },

      showRegetModal: false,

      setShowRegetModal: () => {
        // set((state) => {
        //   return produce(state, (draft) => {
        //     draft.showRegetModal = !draft.showRegetModal;
        //   });
        // });
        set(
          produce((draft) => {
            draft.showRegetModal = !draft.showRegetModal;
          })
        );
      },

      showSponsorModal: false,

      setShowSponsorModal: () => {
        // set((state) => {
        //   return produce(state, (draft) => {
        //     draft.showSponsorModal = !draft.showSponsorModal;
        //   });
        // });
        set(
          produce((draft) => {
            draft.showSponsorModal = !draft.showSponsorModal;
          })
        );
      },

      showLoginModal: false,

      setShowLoginModal: () => {
        // set((state) => {
        //   return produce(state, (draft) => {
        //     draft.showLoginModal = !draft.showLoginModal;
        //   });
        // });
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
