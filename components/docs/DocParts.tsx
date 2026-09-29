import React from "react";
import {
  Badge,
  Box,
  Code,
  Divider,
  Flex,
  Heading,
  Icon,
  Image,
  Link,
  Text,
  VStack,
  type BoxProps,
  type DividerProps,
  type ImageProps,
  type TextProps,
} from "@chakra-ui/react";
import { MdTipsAndUpdates } from "react-icons/md";

/**
 * 联机教程的排版组件
 * ------------------------------------------------------------------
 * 18 个游戏教程页原本各自写死了同一批样式（gray.300 灰字、#7ddcff 蓝边和蓝链接、
 * 黄字提示），亮色模式下几乎不可读。这里把它们收敛成一套组件，
 * 页面只写「内容」，颜色由主题统一决定。
 */

/**
 * 「开始前请注意」提示卡
 * ------------------------------------------------------------------
 * WG 安装教程（app/docs/page.tsx）与各游戏联机教程（DocBox）共用同一份实现，
 * 改样式只改这里，避免两边再次跑偏。
 */
export const DocNotice = ({
  notices,
  title = "开始前请注意",
}: {
  notices: string[];
  title?: string;
}) => (
  <Box
    bg="brand.soft"
    border="1px solid"
    borderColor="brand.line"
    borderRadius="card"
    color="brand.text"
    p={{ base: 4, md: 5 }}
    mb={5}
  >
    <Flex align="center" gap={2} mb={2.5}>
      <Heading as="h2" fontSize="md" color="brand.text">
        {title}
      </Heading>
    </Flex>

    <VStack align="stretch" spacing={1.5}>
      {notices.map((notice, index) => (
        <Text key={`${index}-${notice}`} fontSize="sm" lineHeight="1.8">
          <Icon as={MdTipsAndUpdates} mr={1.5} />
          {notice}
        </Text>
      ))}
    </VStack>
  </Box>
);

/** 次要说明文字（原来是 color="gray.300"） */
export const DocMuted = ({
  children,
  ...rest
}: { children: React.ReactNode } & TextProps) => (
  <Text fontSize="sm" color="text.muted" lineHeight="1.8" {...rest}>
    {children}
  </Text>
);

/**
 * 黄字高亮：需要用户特别注意的词（原来是 color="warning.text" + bold）
 * WG 安装教程页面与新抽出的 WgCommonSteps 共用这一份
 */
export const HighLight: React.FC<TextProps> = ({ children, ...props }) => (
  <Text as="span" color="warning.text" fontWeight="bold" {...props}>
    {children}
  </Text>
);

/** 外链（原来是 color="#7ddcff"） */
export const ExtLink = ({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) => (
  <Link ml={1} color="brand.text" href={href} target="_blank" rel="noreferrer">
    {children}
  </Link>
);

/** 单个步骤：左侧竖线 + 「第 N 步 · 角色」标签 */
export const DocStep = ({
  step,
  role,
  children,
  ...rest
}: {
  step: number | string;
  role: string;
  children: React.ReactNode;
} & BoxProps) => (
  <Box borderLeft="4px solid" borderColor="brand.line" pl={4} {...rest}>
    <Badge colorScheme="blue" mb={1}>
      第 {step} 步 · {role}
    </Badge>
    {children}
  </Box>
);

/**
 * 一条带图标的提示
 * ------------------------------------------------------------------
 * Text 上的 minW={0}：flex 子项默认 min-width:auto，里面放 DocCode 这类超长内容时
 * 整行会被撑宽、连带把卡片和页面顶出横向滚动；归零后才能收缩，交给 DocCode 自己出滚动条。
 */
export const DocTip = ({ children }: { children: React.ReactNode }) => (
  <Flex align="flex-start" gap={1.5}>
    <Icon
      as={MdTipsAndUpdates}
      boxSize={4}
      color="brand.text"
      flexShrink={0}
      mt="3px"
    />
    <Text fontSize="sm" color="text.muted" lineHeight="1.8" as="div" minW={0}>
      {children}
    </Text>
  </Flex>
);

/** 提示列表 */
export const DocTips = ({ children }: { children: React.ReactNode }) => (
  <VStack align="stretch" spacing={2}>
    {children}
  </VStack>
);

/** 命令 / 配置片段（深色代码块，亮暗模式通用） */
export const DocCode = ({
  children,
  block = true,
}: {
  children: React.ReactNode;
  block?: boolean;
}) => (
  <Code
    display={block ? "block" : "inline"}
    // 代码不折行：内容过长时在块内横向滚动，而不是把卡片/页面顶宽。
    // overflow-x 非 visible 时按 CSS 规则 overflow-y 会一并算成 auto，
    // 这里高度自适应，所以不会冒出竖向滚动条。
    whiteSpace="pre"
    overflowX="auto"
    minW={0}
    p={1.5}
    maxW="100%"
    borderRadius="control"
    bg="#0d1117"
    color="#7ee7ff"
    fontSize="sm"
    fontFamily="mono"
    border="1px solid"
    borderColor="border.line"
  >
    {children}
  </Code>
);

/** 教程配图：统一圆角与最大宽度 */
export const DocImage = (props: ImageProps) => (
  <Image borderRadius="control" maxW="100%" my={2} {...props} />
);

/**
 * 教程分节线
 * ------------------------------------------------------------------
 * 各教程页原来都是 `<Divider my={3} />`：上下间距偏紧，而且 Chakra 的 Divider
 * 自带 `opacity: 0.6`，把颜色又冲淡一层，亮暗模式下都几乎看不见。
 * 这里统一成「不透明 + 更明显的 border.divider 色 + 更舒展的上下留白」，
 * 以后要调分节线的间距/颜色，只改这一个组件。
 */
export const DocDivider = (props: DividerProps) => (
  <Divider
    opacity={1}
    borderColor="border.divider"
    my={{ base: 5, md: 6 }}
    {...props}
  />
);
