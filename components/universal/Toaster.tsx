import { Box, useToast, Center, Text } from "@chakra-ui/react";
import { useEffect } from "react";

import { useToastStore } from "./toast";

const TextToast = (props: { text: string; onClick?: () => void }) => {
  return (
    <Center>
      <Text
        mt={5}
        fontWeight="500"
        bg="white"
        color="black"
        fontSize="1rem"
        borderRadius="6rem"
        padding="0.375rem 1rem"
        cursor={props.onClick ? "pointer" : "default"}
        onClick={props?.onClick}
      >
        {props.text}
      </Text>
    </Center>
  );
};

export const useOpenToast = (
  ToastComponent: React.ComponentType<{ text: string }>
) => {
  const toast = useToast();
  const toastStore = useToastStore((state) => {
    return state.toast;
  });

  const { content, clearToast } = toastStore;

  useEffect(() => {
    if (content) {
      toast({
        position: "top",
        duration: 3000,
        render: () => {
          return <ToastComponent text={content} />;
        },
      });
      clearToast();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearToast, content, toast]);
};

export default function Toaster() {
  useOpenToast(TextToast);

  return <Box />;
}
