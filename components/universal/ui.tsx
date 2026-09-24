import { useState } from "react";
import {
  Box,
  Flex,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  type BoxProps,
  type HeadingProps,
  type InputProps,
  type ModalContentProps,
} from "@chakra-ui/react";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

/**
 * 全站通用视觉基元
 * ------------------------------------------------------------------
 * 页面里的卡片、输入框、弹窗、空态统一从这里取，避免各写一份。
 * 颜色一律走 theme.ts 的语义 token（`bg.surface` / `text.muted` …），
 * 因此亮色、暗色模式天然同时成立，不需要在页面里写 `_dark`。
 */

/** 卡片容器（配合 Card 使用；需要自定义时可直接 spread） */
export const CARD_STYLE: BoxProps = {
  w: "100%",
  bg: "bg.surface",
  border: "1px solid",
  borderColor: "border.line",
  borderRadius: "card",
  boxShadow: "var(--nya-shadow-card)",
};

/** 卡片内边距 */
export const CARD_PADDING = { p: { base: 4, md: 5 } };

/**
 * 卡片：`<Card>` = CARD_STYLE + CARD_PADDING，需要更紧凑时传 p / px / py 覆盖。
 */
export const Card = ({
  children,
  ...rest
}: BoxProps & { children?: React.ReactNode }) => (
  <Box {...CARD_STYLE} {...CARD_PADDING} {...rest}>
    {children}
  </Box>
);

/** 输入框：统一走主题里的 app 变体（亮暗自动适配） */
export const INPUT_STYLE: InputProps = {
  variant: "app",
  size: "md",
};

/** 弹窗内容容器：底色/圆角/边框由主题的 Modal baseStyle 统一给，这里只补间距 */
export const MODAL_STYLE: ModalContentProps = {
  mx: 4,
};

/** 表单字段小标题 */
export const SectionTitle = ({
  children,
  ...rest
}: { children: React.ReactNode } & HeadingProps) => (
  <Heading
    as="h4"
    fontSize="sm"
    fontWeight="600"
    color="text.muted"
    letterSpacing="0"
    {...rest}
  >
    {children}
  </Heading>
);

/** 区块标题：卡片内的小节（可选右侧操作区、底部描述） */
export const SectionHeading = ({
  title,
  description,
  action,
  mb = 3,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  mb?: BoxProps["mb"];
}) => (
  <Flex align="center" justify="space-between" gap={3} mb={mb}>
    <Box minW={0}>
      <Heading as="h2" fontSize={{ base: "md", md: "lg" }} fontWeight="700">
        {title}
      </Heading>
      {description && (
        <Text mt={0.5} fontSize="sm" color="text.faint">
          {description}
        </Text>
      )}
    </Box>
    {action}
  </Flex>
);

/** 空态：列表/卡片无数据时统一占位 */
export const EmptyState = ({
  icon,
  title,
  description,
  action,
  py = 10,
}: {
  icon?: React.ComponentType;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  py?: BoxProps["py"];
}) => (
  <Flex direction="column" align="center" justify="center" py={py} gap={2}>
    {icon && <Icon as={icon} boxSize={6} color="text.faint" />}
    <Text fontSize="sm" fontWeight="600" color="text.muted">
      {title}
    </Text>
    {description && (
      <Text fontSize="xs" color="text.faint" textAlign="center" maxW="320px">
        {description}
      </Text>
    )}
    {action && <Box pt={1}>{action}</Box>}
  </Flex>
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
          color="text.faint"
          cursor="pointer"
          _hover={{ color: "brand.text" }}
          onClick={() => setVisible((prev) => !prev)}
        />
      </InputRightElement>
    </InputGroup>
  );
};
