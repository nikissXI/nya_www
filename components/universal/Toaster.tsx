import { Box, useToast } from "@chakra-ui/react";
import { useEffect } from "react";

import { useToastStore } from "./toast";

export const useOpenToast = () => {
  const toast = useToast();
  const toastStore = useToastStore((state) => {
    return state.toast;
  });

  const { content, status, clearToast } = toastStore;

  useEffect(() => {
    if (content) {
      toast({
        position: "top",
        title: content,
        status: status,
        duration: 3000,
        isClosable: true,
      });
      clearToast();
    }
  }, [clearToast, content, status, toast]);
};

export default function Toaster() {
  useOpenToast();

  return <Box />;
}
