"use client";

import { Button as ChakraButton, ButtonProps } from "@chakra-ui/react";

interface CustomButtonProps extends ButtonProps {
  children: React.ReactNode; // 按钮内容
  bgColor?: string;
}
export const Button: React.FC<CustomButtonProps> = ({
  bgColor = "#3e71bd",
  children,
  ...props
}) => {
  return (
    <ChakraButton
      variant="solid"
      // variant="ghost" // 使用 ghost 变体，没有背景色
      bgColor={bgColor}
      colorScheme="transparent" // 或者定义一个透明的颜色方案
      sx={{
        border: "none",
        _hover: {
          backgroundColor: "none", // 悬停时保持透明
          boxShadow: "none",
        },
      }}
      {...props} // 其他 ChakraButton 属性
    >
      {children}
    </ChakraButton>
  );
};