import { produce } from "immer";
import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";
import { v4 as uuidv4 } from "uuid";
// import { openToast } from "@/components/universal/toast";
// import { getHash } from "@/utils/strings";

interface WGData {
  wgnum: number;
  wg_ip: string;
  ttl: number;
}

export interface UserInfo {
  uid: number;
  username: string;
  qq: number;
  tel: number;
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
      uuid: uuidv4(),

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

        const token = localStorage.getItem("token");
        if (token) {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL; // 从环境变量获取 API 地址
          try {
            const response = await fetch(`${apiUrl}/userInfo`, {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            if (!response.ok) {
              throw new Error("key无效");
            }
            const data = await response.json();
            get().setUserInfo(data.data);
            get().changeLoginState(true);
          } catch (error) {
            get().logout();
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
        localStorage.removeItem("token");
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
