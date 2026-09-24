import { Box, Flex, Heading, Image, SimpleGrid, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/universal/button";
import { Card } from "@/components/universal/ui";
import { useUserStateStore } from "@/store/user-state";

/** 平台亮点（静态数据，放到组件外避免每次渲染重新创建） */
const highlights = [
  { title: "免费无广", description: "多个节点免费使用，无任何广告", icon: "✨" },
  { title: "多端支持", description: "支持安卓/苹果/电脑/SteamDeck", icon: "📱" },
  { title: "全球可用", description: "国内多地设有节点，跨境也能用", icon: "🌍" },
];

export default function Page() {
  const navigate = useNavigate();
  const userInfo = useUserStateStore((s) => s.userInfo);

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

        <Button
          size={{ base: "md", md: "lg" }}
          fontSize={{ base: "md", md: "lg" }}
          px={10}
          h={{ base: "48px", md: "56px" }}
          onClick={() => navigate(userInfo ? "/room" : "/me")}
        >
          👉开始使用喵服👈
        </Button>
      </Flex>

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
            _hover={{ transform: "translateY(-2px)", borderColor: "brand.line" }}
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
