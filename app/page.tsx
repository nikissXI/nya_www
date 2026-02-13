"use client";

import { useRouter } from "next/navigation";
import { Flex, Image, Text, Box, Heading } from "@chakra-ui/react";
import { Button } from "@/components/universal/button";
import { useUserStateStore } from "@/store/user-state";
import AnnouncementsModal from "@/components/docs/Announcement";

export default function Page() {
  const router = useRouter();
  const { userInfo, serverData } = useUserStateStore();

  // 平台亮点数据
  const highlights = [
    {
      title: "免费使用",
      description: "无需付费，多个免费节点直接使用",
      icon: "✨",
    },
    {
      title: "多端支持",
      description: "支持安卓/苹果/电脑，支持跨平台联机",
      icon: "📱",
    },
    {
      title: "全球可用",
      description: "全球任意地区均可使用，打破地域限制",
      icon: "🌍",
    },
  ];

  return (
    <Flex direction="column" px={{ base: 4, md: 8 }} align="center">
      {/* 公告模态框 */}
      <AnnouncementsModal />

      {/* 网站统计信息 */}
      <Flex direction="row" justifyContent="center">
        <Text w="150px" textAlign="center" fontSize="sm">
          访问人次：{serverData?.viewCount}
        </Text>
        <Text w="150px" textAlign="center" fontSize="sm">
          用户数量：{serverData?.userCount}
        </Text>
      </Flex>

      {/* Hero 区域 */}
      <Image
        src="/images/logo.png"
        alt="logo"
        maxH={{ base: "120px", md: "160px" }}
        my={3}
      />
      <Heading as="h1" size="lg" fontWeight="bold">
        喵服 - 异地联机解决方案
      </Heading>

      {/* 平台亮点 */}
      <Flex wrap="wrap" justifyContent="center" gap={{ base: 3, md: 6 }} my={6}>
        {highlights.map((highlight, index) => (
          <Box
            key={index}
            w="260px"
            rounded="lg"
            px={2}
            pb={2}
            backdropFilter="blur(2px)"
            border="2px"
            borderColor="#ff737faf"
          >
            <Flex direction="column" align="center" textAlign="center">
              <Text fontSize="3xl">{highlight.icon}</Text>
              <Heading as="h3" size="md" mb={1} color="#fb727e">
                {highlight.title}
              </Heading>
              <Text fontSize="sm" color="white">
                {highlight.description}
              </Text>
            </Flex>
          </Box>
        ))}
      </Flex>

      <Button
        size={{ base: "md", md: "lg" }}
        fontSize={{ base: "md", md: "lg" }}
        px={8}
        py={4}
        onClick={() => {
          if (userInfo) {
            router.push("/room");
          } else {
            router.push("/me");
          }
        }}
      >
        👉开始使用喵服👈
      </Button>
    </Flex>
  );
}
