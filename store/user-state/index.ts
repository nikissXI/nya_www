import { produce } from "immer";
import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";
import { v4 as uuidv4 } from "uuid";
// import { openToast } from "@/components/universal/toast";
// import { getHash } from "@/utils/strings";
import { getAuthToken, clearAuthToken } from "../authKey";

interface WGData {
  wgnum: number;
  wg_ip: string;
  ttl: number;
  last_connect_timestamp: number;
}

export interface UserInfo {
  uid: number;
  username: string;
  qq: string;
  tel: string;
  wg_data: WGData;
}

export interface ILoginStateSlice {
  uuid: string;

  logging: boolean;
  changeloggingState: (state: boolean) => void;

  logined: boolean;
  changeLoginState: (state: boolean) => void;

  getUserInfo: () => Promise<void>;

  logout: () => void;

  userInfo: UserInfo | undefined;
  setUserInfo: (profile: UserInfo | undefined) => void;
}

export const useUserStateStore = createWithEqualityFn<ILoginStateSlice>(
  (set, get) => {
    return {
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

        try {
          const token = getAuthToken();
          if (!token) {
            throw new Error("未登录");
          }
          const apiUrl = process.env.NEXT_PUBLIC_API_URL;
          const resp = await fetch(`${apiUrl}/userInfo`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${getAuthToken()}`,
            },
          });
          if (!resp.ok) {
            throw new Error("登陆凭证失效");
          }
          const data = await resp.json();
          get().setUserInfo(data.data);
          get().changeLoginState(true);
        } catch (error) {
          get().logout();
        } finally {
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
    };
  },
  shallow
);
