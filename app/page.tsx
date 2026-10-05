import {
  Box,
  Flex,
  Heading,
  Image,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Button } from "@/components/universal/button";
import { Card } from "@/components/universal/ui";
import { ANDROID_APP_URL, WINDOWS_APP_URL } from "@/utils/appDownload";

/** 客户端下载（新增平台往这里加一项即可） */
const appDownloads = [
  { label: "下载安卓APP客户端", url: ANDROID_APP_URL },
  { label: "下载Windows客户端", url: WINDOWS_APP_URL },
];

/** 平台亮点（静态数据，放到组件外避免每次渲染重新创建） */
const highlights = [
  {
    title: "免费无广",
    description: "多个节点免费使用，无任何广告",
    icon: "✨",
  },
  {
    title: "多端支持",
    description: "支持安卓/苹果/电脑/SteamDeck",
    icon: "📱",
  },
  {
    title: "全球可用",
    description: "国内多地设有节点，跨境也能用",
    icon: "🌍",
  },
];

export default function Page() {
  return (
    <Flex
      direction="column"
      align="center"
      textAlign="center"
      py={{ base: 2, md: 6 }}
      gap={{ base: 6, md: 10 }}
    >
      {/* Hero */}
      <Flex direction="column" align="center" gap={4}>
        <Image
          src="/images/logo.webp"
          alt="logo"
          maxH={{ base: "104px", md: "148px" }}
          objectFit="contain"
        />

        <Heading
          as="h1"
          fontSize={{ base: "2xl", md: "4xl" }}
          fontWeight="800"
          letterSpacing="-0.02em"
        >
          异地组网联机平台
        </Heading>
      </Flex>

      {/* 客户端下载入口（安卓 / Windows，教程页的下载入口在 app/docs/page.tsx） */}
      <Card
        w="100%"
        maxW="880px"
        bg="brand.soft"
        borderColor="brand.line"
        p={{ base: 4, md: 5 }}
      >
        <Flex
          align="center"
          justify="space-between"
          gap={{ base: 3, md: 4 }}
          flexWrap="wrap"
          textAlign="left"
        >
          <Box minW={0}>
            <Heading
              as="h3"
              fontSize={{ base: "md", md: "lg" }}
              color="brand.text"
            >
              安卓、Windows客户端已上线
            </Heading>

            <Text mt={1} fontSize="sm" lineHeight="1.8">
              客户端内置WG隧道和节点切换，装好登录就能联机。其他系统目前需要浏览器+WG官方客户端配合使用
            </Text>
          </Box>

          <Stack
            direction={{ base: "column", sm: "row" }}
            spacing={2}
            w={{ base: "100%", sm: "auto" }}
            flexShrink={0}
          >
            {appDownloads.map((app) => (
              <Button
                key={app.url}
                size={{ base: "md", md: "lg" }}
                px={{ base: 6, md: 8 }}
                onClick={() => {
                  window.open(app.url, "_blank");
                }}
              >
                {app.label}
              </Button>
            ))}
          </Stack>
        </Flex>
      </Card>

      {/* 平台亮点 */}
      <SimpleGrid
        columns={{ base: 1, sm: 2, md: 3 }}
        spacing={{ base: 3, md: 4 }}
        w="100%"
        maxW="880px"
      >
        {highlights.map((highlight) => (
          <Card
            key={highlight.title}
            p={{ base: 4, md: 5 }}
            transition="transform .2s ease, border-color .2s ease"
            _hover={{
              transform: "translateY(-2px)",
              borderColor: "brand.line",
            }}
          >
            <Flex direction="column" align="center" gap={2}>
              <Text fontSize="3xl" lineHeight="1">
                {highlight.icon}
              </Text>

              <Heading as="h3" fontSize="md" color="brand.text">
                {highlight.title}
              </Heading>

              <Text fontSize="sm" color="text.muted">
                {highlight.description}
              </Text>
            </Flex>
          </Card>
        ))}
      </SimpleGrid>

      {/* 移动端占位：让底部标签栏不压住内容 */}
      <Box h={1} />
    </Flex>
  );
}
