import { Box, useToast } from "@chakra-ui/react";
import { useEffect } from "react";

import { TextToast } from "./TextToast";

import { useToastStore } from "./toast";

export const useOpenToast = (
  ToastComponent: React.ComponentType<{ text: string }>
) => {
  const toast = useToast();
  const toastStore = useToastStore((state) => {
    return state.toast;
  });

  const { content, id, clearToast } = toastStore;

  useEffect(() => {
    if (content) {
      if (id) {
        if (!toast.isActive(id)) {
          toast({
            id,
            position: "top",
            duration: 3000,
            render: () => {
              return <ToastComponent text={content} />;
            },
          });
        }
      } else {
        toast({
          position: "top",
          duration: 3000,
          render: () => {
            return <ToastComponent text={content} />;
          },
        });
      }
      clearToast();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearToast, content, id, toast]);
};

export default function Toaster() {
  useOpenToast(TextToast);

  return <Box />;
}
