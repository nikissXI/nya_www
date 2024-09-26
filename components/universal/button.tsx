"use client";

import { Button as ChakraButton, ButtonProps } from "@chakra-ui/react";

interface CustomButtonProps extends ButtonProps {
  children: React.ReactNode; // 按钮内容
  bgColor?: string;
  color?: string;
}
export const Button: React.FC<CustomButtonProps> = ({
  children,
  bgColor = "#3e71bd",
  color = "white",
  ...props
}) => {
  return (
    <ChakraButton
      variant="solid"
      // variant="ghost" // 使用 ghost 变体，没有背景色
      color={color}
      bgColor={bgColor}
      colorScheme="transparent" // 或者定义一个透明的颜色方案
      sx={{
        border: "none",
        _hover: {
          backgroundColor: "none", // 悬停时背景颜色不变
          boxShadow: "none",
          textDecoration: "none", // 悬停时没有效果
        },
      }}
      {...props} // 其他 ChakraButton 属性
    >
      {children}
    </ChakraButton>
  );
};
