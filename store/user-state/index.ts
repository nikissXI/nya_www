import { produce } from "immer";
import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";
import { v4 as uuidv4 } from "uuid";
import { getAuthToken, clearAuthToken } from "../authKey";
import { openToast } from "@/components/universal/toast";

interface CountData {
  viewCount: number | null;
  userCount: number | null;
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

interface PingResponse {
  ip: string;
}

interface ILoginStateSlice {
  countData: CountData | undefined;
  getCountData: () => Promise<void>;
  setCountData: (countData: CountData) => void;

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
}

export const useUserStateStore = createWithEqualityFn<ILoginStateSlice>(
  (set, get) => {
    return {
      countData: undefined,

      getCountData: async () => {
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL;
          const resp = await fetch(`${apiUrl}/countInfo`);
          if (!resp.ok) {
            throw new Error("请求出错");
          }
          const data = await resp.json();
          get().setCountData(data);
        } catch (error) {
        } finally {
        }
      },

      setCountData: (countData: CountData) => {
        set((state) => {
          return produce(state, (draft) => {
            draft.countData = countData;
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
            openToast({ content: "绑定编号成功", status: "success" });
            get().getUserInfo();
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
              throw new Error("请求出错");
            }
            const data = await resp.json();
            get().setUserInfo(data.data);
            get().changeLoginState(true);
          } catch (error) {
            openToast({
              content: "服务器出错，请稍后刷新再试",
              status: "error",
            });
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

          if (data.wgInsert) {
            openToast({
              content: `隧道重载，等10秒再点检测`,
              status: "warning",
            });
          }

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

        const pingUrl = process.env.NEXT_PUBLIC_PING_URL as string;

        try {
          const timeout = (ms: number) => {
            return new Promise((_, reject) => {
              setTimeout(() => reject(new Error("Timeout")), ms);
            });
          };

          const resp = await Promise.race([fetch(pingUrl), timeout(1000)]);

          // 确保结果是 Response 类型
          if (!(resp instanceof Response)) {
            throw new Error("Invalid response type");
          }

          const data = (await resp.json()) as PingResponse;
          if (data.ip !== get().userInfo?.wg_data?.wg_ip)
            throw new Error("错误wgip");

          const entries = performance.getEntriesByName(pingUrl);
          const lastEntry = entries.at(-1) as PerformanceResourceTiming;
          if (lastEntry) {
            get().setLatency(
              Math.floor(lastEntry.responseStart - lastEntry.requestStart)
            );

            get().setOnlineStatus("在线");
          } else {
            openToast({
              content: "获取延迟出错，请联系服主处理",
              status: "error",
            });
          }
          /////////////////////
        } catch (error) {
          if (
            error instanceof TypeError &&
            error.message.includes("Failed to fetch")
          ) {
            try {
              const apiUrl = process.env.NEXT_PUBLIC_API_URL;
              const statusUrl = `${apiUrl}/onlineStatus?ip=${
                get().userInfo?.wg_data?.wg_ip
              }`;
              const resp = await fetch(statusUrl);
              if (!resp.ok) {
                throw new Error("请求出错");
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
                } else {
                  openToast({
                    content: "获取延迟出错，请联系服主处理",
                    status: "error",
                  });
                }
              } else {
                get().setLatency(0);
              }
            } catch (error) {
              openToast({
                content: "服务器出错，请稍后刷新再试",
                status: "error",
              });
            } finally {
            }
          } else {
            get().setOnlineStatus("离线");
            get().setLatency(0);
            openToast({
              content: "离线无法联机，不懂就看教程",
              status: "warning",
            });
          }
        } finally {
          get().setRotate(false);
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
    };
  },
  shallow
);
