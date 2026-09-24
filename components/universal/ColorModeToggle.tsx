import { Icon, IconButton, Tooltip, useColorMode } from "@chakra-ui/react";
import type { IconButtonProps } from "@chakra-ui/react";
import { MdDarkMode, MdLightMode } from "react-icons/md";

/**
 * 亮色 / 暗色模式切换按钮
 * ------------------------------------------------------------------
 * 默认主题跟随系统（见 theme.ts 的 initialColorMode），
 * 用户点过之后就固定为其选择，并写入 localStorage。
 */
export default function ColorModeToggle(
  props: Omit<IconButtonProps, "aria-label" | "icon" | "onClick">,
) {
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === "dark";

  return (
    <Tooltip
      label={isDark ? "切换到亮色模式" : "切换到暗色模式"}
      hasArrow
      openDelay={200}
      placement="bottom"
    >
      <IconButton
        aria-label="切换亮色 / 暗色模式"
        icon={<Icon as={isDark ? MdLightMode : MdDarkMode} boxSize={5} />}
        variant="ghost"
        color="text.muted"
        borderRadius="full"
        transition="transform .25s ease, color .2s ease"
        _hover={{ bg: "bg.hover", color: "text.main" }}
        _active={{ transform: "scale(.9) rotate(35deg)" }}
        onClick={toggleColorMode}
        {...props}
      />
    </Tooltip>
  );
}
