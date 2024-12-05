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
  countData: CountData | undefined;
  getCountData: () => Promise<void>;
  setCountData: (countData: CountData) => void;

  uuid: string;

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

  getLatency: (wgnum: number) => Promise<void>;

  setLatency: (latency: number) => void;
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
        get().setUserInfo(undefined);
        get().changeLoginState(false);
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

      getLatency: async (wgnum: number) => {
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL;
          const resp = await fetch(`${apiUrl}/networkCheck?wgnum=${wgnum}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${getAuthToken()}`,
            },
          });
          if (!resp.ok) {
            throw new Error("请求出错");
          }
          const data = await resp.json();
          if (data.ms === 0) {
            // 未连接
            get().setLatency(0);
            openToast({
              content: "离线无法联机，不懂就看教程",
              status: "warning",
            });
          } else {
            // 已连接
            get().setLatency(data.ms);
          }
        } catch (error) {
          openToast({
            content: "服务器出错，请稍后刷新再试",
            status: "error",
          });
        } finally {
        }
      },

      setLatency: (latency: number) => {
        set((state) => {
          return produce(state, (draft) => {
            draft.latency = latency;
          });
        });
      },
    };
  },
  shallow
);
