import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

/**
 * 全站主题：现代简约 · 喵蓝
 * ------------------------------------------------------------------
 * 设计原则
 * 1. 页面里**不再写死颜色**，一律使用这里的语义 token（`bg.surface` / `text.muted` …），
 *    这样亮色与暗色模式天然同时成立，切换主题不会漏改。
 * 2. 颜色分三层：底（page）→ 面（surface/raised）→ 浮层（subtle/hover）。
 *    亮色靠阴影区分层级，暗色靠明度差区分层级。
 * 3. 组件默认样式尽量在主题里定（Modal / Menu / Input / Button），
 *    页面里只写业务相关的差异，避免每个页面各写一份圆角和边框。
 *
 * 颜色模式：默认跟随系统，用户切换后写 localStorage（Chakra 默认 key）。
 */

const config: ThemeConfig = {
  /** 首次访问跟随系统；用户手动切换后固定为其选择 */
  initialColorMode: "system",
  useSystemColorMode: false,
};

/** 不引入外部字体，直接用系统字体栈，保证首屏无 FOIT */
export const FONT_STACK = [
  "-apple-system",
  "BlinkMacSystemFont",
  '"Segoe UI"',
  '"PingFang SC"',
  '"Hiragino Sans GB"',
  '"Microsoft YaHei"',
  '"Noto Sans SC"',
  "Roboto",
  "Helvetica",
  "Arial",
  "sans-serif",
].join(", ");

/** 品牌主色（Tailwind blue 标度，主色 500 = #3B82F6） */
const brand = {
  50: "#EFF6FF",
  100: "#DBEAFE",
  200: "#BFDBFE",
  300: "#93C5FD",
  400: "#60A5FA",
  500: "#3B82F6",
  600: "#2563EB",
  700: "#1D4ED8",
  800: "#1E40AF",
  900: "#1E3A8A",
};

const theme = extendTheme({
  config,

  fonts: {
    heading: FONT_STACK,
    body: FONT_STACK,
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
  },

  colors: { brand },

  radii: {
    control: "10px",
    card: "16px",
  },

  semanticTokens: {
    colors: {
      /* ---------- 背景层 ---------- */
      "bg.page": { default: "#F5F7FB", _dark: "#080D18" },
      "bg.surface": { default: "#FFFFFF", _dark: "#0F1729" },
      "bg.raised": { default: "#FFFFFF", _dark: "#141E33" },
      "bg.subtle": { default: "#EEF3FA", _dark: "#18233A" },
      "bg.hover": { default: "#E7EEF9", _dark: "#1D2942" },
      "bg.active": { default: "#DDE7F7", _dark: "#223050" },
      "bg.inverted": { default: "#101828", _dark: "#E9EEF8" },

      /* ---------- 描边 ---------- */
      "border.line": { default: "#E4EAF3", _dark: "#1F2B45" },
      "border.strong": { default: "#CDD8E7", _dark: "#2E3D5C" },
      /** 教程分节线：比 border.strong 再明显一点，亮暗模式下都能看清 */
      "border.divider": { default: "#AEBED5", _dark: "#35456A" },

      /* ---------- 文字 ---------- */
      "text.main": { default: "#101828", _dark: "#E9EEF8" },
      "text.muted": { default: "#475467", _dark: "#A2B0C7" },
      "text.faint": { default: "#7B8798", _dark: "#78889F" },
      "text.inverted": { default: "#FFFFFF", _dark: "#080D18" },

      /* ---------- 品牌色语义 ---------- */
      "brand.soft": { default: "#E8F0FE", _dark: "rgba(59, 130, 246, 0.16)" },
      "brand.solid": { default: "#2563EB", _dark: "#2563EB" },
      "brand.solidHover": { default: "#1D4ED8", _dark: "#3B82F6" },
      "brand.solidActive": { default: "#1E40AF", _dark: "#1D4ED8" },
      "brand.text": { default: "#1D4ED8", _dark: "#8CBAFF" },
      "brand.line": { default: "#BFD8FE", _dark: "rgba(59, 130, 246, 0.38)" },

      /* ---------- 危险操作 ---------- */
      "danger.soft": { default: "#FEECEC", _dark: "rgba(239, 68, 68, 0.16)" },
      "danger.solid": { default: "#DC2626", _dark: "#EF4444" },
      "danger.solidHover": { default: "#B42318", _dark: "#F87171" },
      "danger.text": { default: "#B42318", _dark: "#FCA5A5" },
      "danger.line": { default: "#FBD5D5", _dark: "rgba(239, 68, 68, 0.38)" },

      /* ---------- 提示色（公告条 / 警示） ---------- */
      "warning.soft": { default: "#FFF6E5", _dark: "rgba(245, 158, 11, 0.16)" },
      "warning.text": { default: "#B45309", _dark: "#FBCB6B" },
      "warning.line": { default: "#FDE3B0", _dark: "rgba(245, 158, 11, 0.36)" },

      "success.soft": { default: "#E9F9F0", _dark: "rgba(16, 185, 129, 0.16)" },
      "success.text": { default: "#067647", _dark: "#6EE7B7" },
      "success.line": { default: "#C4EED8", _dark: "rgba(16, 185, 129, 0.36)" },
    },
  },

  shadows: {
    /** 卡片：亮色靠柔和投影，暗色靠描边（暗色下由 --nya-shadow-card 覆盖） */
    card: "var(--nya-shadow-card)",
    pop: "var(--nya-shadow-pop)",
  },

  styles: {
    global: {
      "html, body": {
        bg: "bg.page",
        color: "text.main",
      },
      body: {
        fontFamily: "body",
        minHeight: "100dvh",
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
        textRendering: "optimizeLegibility",
      },
      "*, *::before, *::after": {
        borderColor: "border.line",
      },
      "::selection": {
        bg: "brand.solid",
        color: "text.inverted",
      },
      "a": {
        color: "inherit",
      },
      // 键盘聚焦统一可见，鼠标点击不出现焦点环
      ":focus-visible": {
        outline: "2px solid",
        outlineColor: "brand.solid",
        outlineOffset: "2px",
      },
      // 数字等宽，避免倒计时跳动
      ".tabular": {
        fontVariantNumeric: "tabular-nums",
      },
    },
  },

  components: {
    Button: {
      baseStyle: {
        fontWeight: "600",
        borderRadius: "control",
      },
      /**
       * Chakra 默认在暗色模式下会把实心按钮反色成「浅底深字」，
       * 这里改成亮暗都用实心主色 + 白字，保证主操作在两种模式下同样醒目。
       * 注意：variants.solid 会被整体替换掉，所以其它配色也要在这里给出实现。
       */
      variants: {
        solid: (props: { colorScheme?: string }) => {
          const c = props.colorScheme;

          if (!c || c === "transparent") {
            return {
              bg: "transparent",
              color: "inherit",
              _hover: { bg: "bg.hover" },
              _active: { bg: "bg.active" },
            };
          }

          if (c === "brand") {
            return {
              bg: "brand.solid",
              color: "white",
              _hover: {
                bg: "brand.solidHover",
                _disabled: { bg: "brand.solid" },
              },
              _active: { bg: "brand.solidActive" },
              _disabled: { opacity: 0.5 },
            };
          }

          return {
            bg: `${c}.600`,
            color: "white",
            _hover: { bg: `${c}.500`, _disabled: { bg: `${c}.600` } },
            _active: { bg: `${c}.700` },
            _disabled: { opacity: 0.5 },
          };
        },
      },
      defaultProps: {
        colorScheme: "brand",
      },
    },

    Heading: {
      baseStyle: {
        fontWeight: "700",
        letterSpacing: "-0.01em",
      },
    },

    Badge: {
      baseStyle: {
        borderRadius: "full",
        fontWeight: "600",
        px: 2,
      },
    },

    Link: {
      baseStyle: {
        fontWeight: "600",
      },
    },

    Divider: {
      baseStyle: {
        borderColor: "border.line",
      },
    },

    /** 输入类控件统一走 app 变体：由 ui.tsx 的 INPUT_STYLE 引用 */
    Input: {
      variants: {
        app: {
          field: {
            bg: "bg.subtle",
            border: "1px solid",
            borderColor: "border.line",
            color: "text.main",
            borderRadius: "control",
            _placeholder: { color: "text.faint" },
            _hover: { borderColor: "border.strong" },
            _focus: {
              borderColor: "brand.solid",
              boxShadow: "0 0 0 3px var(--nya-ring)",
            },
          },
        },
      },
    },

    Textarea: {
      variants: {
        app: {
          bg: "bg.subtle",
          border: "1px solid",
          borderColor: "border.line",
          color: "text.main",
          borderRadius: "control",
          _placeholder: { color: "text.faint" },
          _hover: { borderColor: "border.strong" },
          _focus: {
            borderColor: "brand.solid",
            boxShadow: "0 0 0 3px var(--nya-ring)",
          },
        },
      },
    },

    Select: {
      variants: {
        app: {
          field: {
            bg: "bg.subtle",
            border: "1px solid",
            borderColor: "border.line",
            color: "text.main",
            borderRadius: "control",
            transition:
              "border-color .2s ease, box-shadow .2s ease, background-color .2s ease",
            _placeholder: { color: "text.faint" },
            _hover: { borderColor: "border.strong" },
            _focus: {
              borderColor: "brand.solid",
              boxShadow: "0 0 0 3px var(--nya-ring)",
            },
          },
        },
      },
    },

    /** 弹窗：亮暗统一使用浮层色，避免每个页面重写一遍 */
    Modal: {
      baseStyle: {
        dialog: {
          bg: "bg.raised",
          color: "text.main",
          borderRadius: "card",
          boxShadow: "var(--nya-shadow-pop)",
          border: "1px solid",
          borderColor: "border.line",
        },
        header: {
          fontWeight: "700",
        },
      },
    },

    Menu: {
      baseStyle: {
        list: {
          bg: "bg.raised",
          borderColor: "border.line",
          boxShadow: "var(--nya-shadow-pop)",
          borderRadius: "control",
          py: 1,
        },
        item: {
          bg: "bg.raised",
          borderRadius: "md",
          mx: 1,
          _hover: { bg: "bg.hover" },
          _focus: { bg: "bg.hover" },
          _active: { bg: "bg.active" },
        },
      },
    },

    Alert: {
      baseStyle: {
        container: {
          borderRadius: "card",
        },
      },
    },

    Table: {
      baseStyle: {
        th: {
          borderColor: "border.line",
        },
        td: {
          borderColor: "border.line",
        },
      },
    },

    Tabs: {
      defaultProps: {
        colorScheme: "brand",
      },
    },
  },
});

export default theme;
