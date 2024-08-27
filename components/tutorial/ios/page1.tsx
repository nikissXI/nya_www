"use client";
import { Flex, Center, Text, Image, Heading } from "@chakra-ui/react";
import { Button } from "@/components/universal";

export function Page() {
  const wg_apk_url = process.env.NEXT_PUBLIC_WG_APK_URL; // 从环境变量获取 API 地址

  return (
    <Center>
      <Flex
        direction="column"
        justifyContent="space-between"
        alignItems="center"
        maxW="460px"
      >
        <Heading size="md" mb={3}>
          下载WG安装包
        </Heading>

        <Button
          size="sm"
          onClick={() => {
            window.open(wg_apk_url, "_blank");
          }}
        >
          点击下载WG安装包
        </Button>

        <Image my={3} maxW="240px" src="/images/apk_logo.jpg" alt="apk_logo" />

        <Text>下载后完成安装</Text>
      </Flex>
    </Center>
  );
}
