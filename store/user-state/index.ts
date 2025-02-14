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
  wgnum: number;
  wg_ip: string;
  last_connect_timestamp: number;
  release_days: number;
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
  wgnum: number;
  ip: string;
  status: "在线" | "离线";
}
interface RoomInfo {
  user_wgnum: number;
  user_ip: string;
  hoster_wgnum: number;
  hoster_ip: string;
  members: Member[];
  room_passwd: string;
}

interface ILoginStateSlice {
  serverData: ServerData | undefined;
  getServerData: () => Promise<void>;
  setServerData: (serverData: ServerData) => void;

  uuid: string;

  confKey: string | null;
  getConfKey: () => void;

  getWgnum: () => void;

  logging: boolean;
  changeloggingState: (state: boolean) => void;

  logined: boolean;
  changeLoginState: (state: boolean) => void;

  getUserInfo: () => Promise<void>;

  logout: () => void;

  userInfo: UserInfo | undefined;
  setUserInfo: (profile: UserInfo | undefined) => void;

  roomStatus: "none" | "member" | "hoster";
  setRoomStatus: (roomStatus: "none" | "member" | "hoster") => void;

  roomData: RoomInfo | undefined | null;
  getRoomData: () => Promise<void>;
  setRoomData: (roomData: RoomInfo | undefined | null) => void;

  latency: number | undefined;
  getLatency: () => Promise<void>;
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

      setServerData: (serverData: ServerData) => {
        set((state) => {
          return produce(state, (draft) => {
            draft.serverData = serverData;
          });
        });
      },

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
            set((state) => {
              return produce(state, (draft) => {
                draft.confKey = data.key;
              });
            });
          } else {
            openToast({ content: data.msg, status: "warning" });
          }
        } catch (error) {
          openToast({ content: "服务异常，请联系服主处理", status: "error" });
        } finally {
        }
      },

      getWgnum: async () => {
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL;
          const resp = await fetch(`${apiUrl}/getWgnum`, {
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
              content: `编号${data.wgnum}绑定成功`,
              status: "success",
            });
            get().getUserInfo();

            if (data.reget_wgnum) {
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
        set((state) => {
          return produce(state, (draft) => {
            draft.logging = loggingState;
          });
        });
      },

      logined: false,
      changeLoginState: (loginState: boolean) => {
        set((state) => {
          return produce(state, (draft) => {
            draft.logined = loginState;
          });
        });
      },

      getUserInfo: async () => {
        set((state) => {
          return produce(state, (draft) => {
            draft.logging = true;
          });
        });

        const _uuid = localStorage.getItem("uuid");
        if (_uuid) {
          set((state) => {
            return produce(state, (draft) => {
              draft.uuid = _uuid;
            });
          });
        } else {
          set((state) => {
            return produce(state, (draft) => {
              draft.uuid = uuidv4();
              localStorage.setItem("uuid", draft.uuid);
            });
          });
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

        set((state) => {
          return produce(state, (draft) => {
            draft.logging = false;
          });
        });
      },

      logout: () => {
        clearAuthToken();
        set((state) => {
          return produce(state, (draft) => {
            draft.uuid = uuidv4();
            localStorage.setItem("uuid", draft.uuid);
          });
        });
        get().setUserInfo(undefined);
        get().changeLoginState(false);
        get().setRoomStatus("none");
        get().setRoomData(undefined);
        get().setLatency(undefined);
      },

      userInfo: undefined,

      setUserInfo: (profile: UserInfo | undefined) => {
        set((state) => {
          return produce(state, (draft) => {
            draft.userInfo = profile;
          });
        });
      },

      roomStatus: "none",

      setRoomStatus: (roomStatus: "none" | "member" | "hoster") => {
        set((state) => {
          return produce(state, (draft) => {
            draft.roomStatus = roomStatus;
          });
        });
      },

      roomData: undefined,

      getRoomData: async () => {
        if (!get().userInfo?.wg_data) return;

        try {
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

          if (data.code === -1) {
            // 编号失效刷新页面
            window.location.reload();
          }

          // 使用局部变量进行状态判断
          if (data.data) {
            // 房主或成员
            if (data.data.user_wgnum === data.data.hoster_wgnum) {
              get().setRoomStatus("hoster");
            } else {
              get().setRoomStatus("member");
            }
          } else {
            get().setRoomStatus("none");
          }
          openToast({ content: `房间信息已刷新`, status: "info" });

          get().setRoomData(data.data);
        } catch (error) {
          openToast({
            content: "服务器出错，请稍后刷新再试",
            status: "error",
          });
        } finally {
        }
      },

      setRoomData: (roomData: RoomInfo | undefined | null) => {
        set((state) => {
          return produce(state, (draft) => {
            draft.roomData = roomData;
          });
        });
      },

      latency: undefined,

      getLatency: async () => {
        if (!get().userInfo?.wg_data) return;

        get().setRotate(true);
        performance.clearResourceTimings();

        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL;
          const statusUrl = `${apiUrl}/onlineStatus?wgnum=${
            get().userInfo?.wg_data?.wgnum
          }`;
          const resp = await fetch(statusUrl);
          if (!resp.ok) {
            throw new Error("服务器出错，稍等再试试？");
          }
          const data = await resp.json();

          get().setOnlineStatus(data.status);

          if (data.status === "在线") {
            const entries = performance.getEntriesByName(statusUrl);
            const lastEntry = entries.at(-1) as PerformanceResourceTiming;
            if (lastEntry) {
              get().setLatency(
                Math.floor(lastEntry.responseStart - lastEntry.requestStart)
              );

              const pingCount = localStorage.getItem("pingCount");
              if (pingCount) {
                const newPingCount = Number(pingCount) + 1;

                if (newPingCount === 50) {
                  get().setShowSponsorModal();
                }

                localStorage.setItem("pingCount", newPingCount.toString());
              } else {
                localStorage.setItem("pingCount", "1");
              }
            } else {
              openToast({
                content: "获取延迟出错，请联系服主处理",
                status: "error",
              });
            }
          } else {
            get().setLatency(0);

            if (data.code === 0) {
              openToast({
                content: "离线无法联机，不懂就看使用文档",
                status: "warning",
              });
            } else {
              openToast({
                content: `隧道重载，等10秒再点检测或重连WG`,
                status: "warning",
              });
            }
          }
        } catch (error) {
          if (error instanceof Error) {
            if (error.message === "Failed to fetch") {
              openToast({
                content: "换个浏览器再试试，还不行找服主",
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
              content: "换个浏览器再试试，还不行找服主",
              status: "error",
            });
          }
        } finally {
          get().setRotate(false);

          if (get().onlineStatus === "在线" && get().latency === 0)
            openToast({
              content: "在线且延迟为0，你需要换个浏览器",
              status: "warning",
            });
        }
      },

      setLatency: (latency: number | undefined) => {
        set((state) => {
          return produce(state, (draft) => {
            draft.latency = latency;
          });
        });
      },

      rotate: false,

      setRotate: (rotate: boolean) => {
        set((state) => {
          return produce(state, (draft) => {
            draft.rotate = rotate;
          });
        });
      },

      onlineStatus: "离线",

      setOnlineStatus: (onlineStatus: "在线" | "离线") => {
        set((state) => {
          return produce(state, (draft) => {
            draft.onlineStatus = onlineStatus;
          });
        });
      },

      showRegetModal: false,

      setShowRegetModal: () => {
        set((state) => {
          return produce(state, (draft) => {
            draft.showRegetModal = !draft.showRegetModal;
          });
        });
      },

      showSponsorModal: false,

      setShowSponsorModal: () => {
        set((state) => {
          return produce(state, (draft) => {
            draft.showSponsorModal = !draft.showSponsorModal;
          });
        });
      },

      showLoginModal: false,

      setShowLoginModal: () => {
        set((state) => {
          return produce(state, (draft) => {
            draft.showLoginModal = !draft.showLoginModal;
          });
        });
      },
    };
  },
  shallow
);
