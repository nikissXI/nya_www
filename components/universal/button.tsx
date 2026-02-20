"use client";

import { Button as ChakraButton, ButtonProps } from "@chakra-ui/react";

interface CustomButtonProps extends ButtonProps {
  children: React.ReactNode; // 按钮内容
  bgColor?: string;
  colorScheme?: string;
  color?: string;
  fontSize?: any;
}
export const Button: React.FC<CustomButtonProps> = ({
  children,
  bgColor = "#2976bd",
  colorScheme = "transparent",
  color = "white",
  fontSize = "md",
  ...props
}) => {
  return (
    <ChakraButton
      variant="solid"
      // variant="ghost" // 使用 ghost 变体，没有背景色
      color={color}
      bgColor={bgColor}
      colorScheme={colorScheme} // 或者定义一个透明的颜色方案
      fontSize={fontSize}
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
