import React from "react";
import { Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();
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
        navigate(-1);
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
