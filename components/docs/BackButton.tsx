import React from "react";
import { Button } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

const BackButton = () => {
  const router = useRouter();
  return (
    <Button
      colorScheme="transparent"
      variant="solid"
      color="white"
      bgColor="#b23333"
      w="auto"
      alignSelf="center"
      px={10}
      onClick={() => {
        router.back();
      }}
      sx={{
        border: "none",
        _hover: {
          backgroundColor: "none", // 悬停时背景颜色不变
          boxShadow: "none",
          textDecoration: "none", // 悬停时没有效果
        },
      }}
    >
      返回
    </Button>
  );
};

export default BackButton;
