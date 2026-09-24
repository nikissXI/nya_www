import { useState } from "react";
import {
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  type BoxProps,
  type InputProps,
  type ModalContentProps,
} from "@chakra-ui/react";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

/**
 * 全站通用视觉常量
 * ------------------------------------------------------------
 * 页面里的卡片、输入框、弹窗都从这里取样式，避免各页面各写一份导致深浅不一。
 * 目前使用方：app/room/page.tsx、app/me/page.tsx、app/register/page.tsx、app/forgetPass/page.tsx
 */

/** 卡片：半透明蓝底 + 细边框 */
export const CARD_STYLE: BoxProps = {
  w: "100%",
  borderRadius: "xl",
  bg: "rgba(52, 139, 246, 0.18)",
  border: "1px solid",
  borderColor: "rgba(125, 212, 255, 0.18)",
  boxShadow: "0 4px 14px rgba(0, 0, 0, 0.12)",
};

/** 卡片内边距（和 CARD_STYLE 搭配使用） */
export const CARD_PADDING = { px: 3, py: 2.5 };

/** 输入框：暗底 + 聚焦高亮 */
export const INPUT_STYLE: InputProps = {
  bg: "rgba(0, 0, 0, 0.25)",
  border: "1px solid",
  borderColor: "rgba(255, 255, 255, 0.14)",
  color: "white",
  _placeholder: { color: "rgba(255, 255, 255, 0.45)" },
  _hover: { borderColor: "rgba(125, 212, 255, 0.5)" },
  _focus: { borderColor: "#7ddcff", boxShadow: "0 0 0 1px #7ddcff" },
};

/** 弹窗：统一深蓝底 + 细边框 */
export const MODAL_STYLE: ModalContentProps = {
  bg: "#0e2949",
  color: "white",
  border: "1px solid",
  borderColor: "rgba(125, 212, 255, 0.25)",
  borderRadius: "xl",
  mx: 4,
};

/** 卡片/表单行内的小标题 */
export const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <Text fontSize="xs" fontWeight="bold" color="#a8d1ff" letterSpacing="0.08em">
    {children}
  </Text>
);

/**
 * 密码输入框：右侧带“显示 / 隐藏”切换。
 * 注意：需要外边距时请用外层 Box 控制（直接传 mt 会让头像与输入框错位）。
 */
export const PasswordInput = (
  props: Omit<InputProps, "value" | "onChange" | "type"> & {
    value: string;
    onChange: (value: string) => void;
  },
) => {
  const { value, onChange, ...rest } = props;
  const [visible, setVisible] = useState(false);

  return (
    <InputGroup>
      <Input
        type={visible ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        pr={10}
        {...INPUT_STYLE}
        {...rest}
      />

      <InputRightElement h="100%">
        <Icon
          as={visible ? MdVisibilityOff : MdVisibility}
          // 注意：Chakra 的 sizes 标度里没有 4.5，boxSize={4.5} 会被当成 4.5px
          boxSize={5}
          color="rgba(255, 255, 255, 0.6)"
          cursor="pointer"
          _hover={{ color: "#7ddcff" }}
          onClick={() => setVisible((prev) => !prev)}
        />
      </InputRightElement>
    </InputGroup>
  );
};
