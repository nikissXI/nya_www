import { Button as ChakraButton, type ButtonProps } from "@chakra-ui/react";

interface CustomButtonProps extends ButtonProps {
  children: React.ReactNode;
  /** @deprecated 请改用 colorScheme / variant 表达语义，不再写死色值 */
  bgColor?: string;
  colorScheme?: string;
  color?: string;
  fontSize?: ButtonProps["fontSize"];
}

/**
 * 全站按钮
 * ------------------------------------------------------------------
 * 默认 = 品牌色实心按钮（亮暗模式都由主题的 solid 变体负责）。
 * 危险操作请用 `colorScheme="red"`，次要操作请用 `variant="outline" | "ghost"`。
 * `bgColor` 仅为了兼容历史调用保留，新代码不要再传。
 */
export const Button: React.FC<CustomButtonProps> = ({
  children,
  bgColor,
  colorScheme = "brand",
  color,
  fontSize = "md",
  ...props
}) => {
  return (
    <ChakraButton
      variant="solid"
      colorScheme={colorScheme}
      bgColor={bgColor}
      color={color}
      fontSize={fontSize}
      {...props}
    >
      {children}
    </ChakraButton>
  );
};
