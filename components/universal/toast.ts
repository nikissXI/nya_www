import { produce } from "immer";
import { create } from "zustand";

export interface IToast {
  toast: {
    content: string;
    id: string | number;
    openToast: (props: { content: string; id?: string | number }) => void;
    clearToast: () => void;
  };
}

export const useToastStore = create<IToast>((set) => {
  return {
    toast: {
      content: "",
      id: "",
      openToast: (props: { content: string; id?: string | number }) => {
        const { content, id } = props;
        set((state) => {
          return produce(state, (draft) => {
            draft.toast.content = content;
            if (id) {
              draft.toast.id = id;
            }
          });
        });
      },
      clearToast: () => {
        set((state) => {
          return produce(state, (draft) => {
            draft.toast.content = "";
            draft.toast.id = "";
          });
        });
      },
    },
  };
});

export const openToast = (props: { content: string; id?: string | number }) => {
  return useToastStore.getState().toast.openToast(props);
};
