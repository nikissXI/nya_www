import { produce } from "immer";
import { create } from "zustand";

export interface IToast {
  toast: {
    content: string;
    status: "success" | "info" | "warning" | "error";
    openToast: (props: {
      content: string;
      status: "success" | "info" | "warning" | "error";
    }) => void;
    clearToast: () => void;
  };
}

export const useToastStore = create<IToast>((set) => {
  return {
    toast: {
      content: "",
      status: "success",
      openToast: (props: {
        content: string;
        status: "success" | "info" | "warning" | "error";
      }) => {
        const { content, status } = props;
        set((state) => {
          return produce(state, (draft) => {
            draft.toast.content = content;
            draft.toast.status = status;
          });
        });
      },
      clearToast: () => {
        set((state) => {
          return produce(state, (draft) => {
            draft.toast.content = "";
            draft.toast.status = "success";
          });
        });
      },
    },
  };
});

export const openToast = (props: {
  content: string;
  status: "success" | "info" | "warning" | "error";
}) => {
  return useToastStore.getState().toast.openToast(props);
};
