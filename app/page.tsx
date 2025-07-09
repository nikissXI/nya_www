"use client";

import { useRouter } from "next/navigation";
import { Flex, Image, Center, Text } from "@chakra-ui/react";
import { Button } from "@/components/universal/button";
import { useUserStateStore } from "@/store/user-state";
import SponsorAd from "@/components/docs/AD";

export default function Page() {
  const router = useRouter();
  const { logined, serverData } = useUserStateStore();

  return (
    <Flex direction="column" justifyContent="space-between" alignItems="center">
      <SponsorAd />

      <Flex
        wrap="wrap"
        direction={{ base: "column", md: "row" }}
        justifyContent="center"
        mb={6}
      >
        <Text w="200px" textAlign={{ md: "center" }}>
          网站访问人次： {serverData?.viewCount}
        </Text>
        <Text w="200px" textAlign={{ md: "center" }}>
          注册用户数量： {serverData?.userCount}
        </Text>
      </Flex>

      <Center>
        <Image
          src="/images/logo.png"
          alt="logo"
          maxH={{ base: "130px", md: "180px" }}
        />
      </Center>

      <Flex
        wrap="wrap"
        justifyContent="center"
        direction={{ base: "column", md: "row" }}
      >
        <Flex direction="column" mx={3} mt={6} width="230px">
          <Center color="#fb727e" fontSize="lg" fontWeight="bold">
            免费使用
          </Center>
          <Text fontSize="sm">
            提供异地组网服务解决联机问题，支持部分广播包转发，最多8人联机
          </Text>
        </Flex>

        <Flex direction="column" mx={3} mt={6} width="230px">
          <Center color="#fb727e" fontSize="lg" fontWeight="bold">
            多端互联
          </Center>
          <Text fontSize="sm">
            支持所有手机、平板、电脑，若游戏支持可实现跨系统联机
          </Text>
        </Flex>
      </Flex>

      <Button
        mt={6}
        fontSize="lg"
        onClick={() => {
          if (logined) {
            router.push("/room");
          } else {
            router.push("/me");
          }
        }}
      >
        &gt;&gt; 开始使用喵服 &lt;&lt;
      </Button>

      <Button
        mt={6}
        fontSize="lg"
        onClick={() => {
          throw new Error("错凑错!");
        }}
      >
        &gt;&gt; ERROR &lt;&lt;
      </Button>
    </Flex>
  );
}
