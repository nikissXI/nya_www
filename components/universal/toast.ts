import { produce } from "immer";
import { create } from "zustand";

export interface IToast {
  toast: {
    content: string;
    openToast: (props: { content: string }) => void;
    clearToast: () => void;
  };
}

export const useToastStore = create<IToast>((set) => {
  return {
    toast: {
      content: "",
      openToast: (props: { content: string }) => {
        const { content } = props;
        set((state) => {
          return produce(state, (draft) => {
            draft.toast.content = content;
          });
        });
      },
      clearToast: () => {
        set((state) => {
          return produce(state, (draft) => {
            draft.toast.content = "";
          });
        });
      },
    },
  };
});

export const openToast = (props: { content: string }) => {
  return useToastStore.getState().toast.openToast(props);
};
