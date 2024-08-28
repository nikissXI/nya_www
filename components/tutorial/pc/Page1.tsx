"use client";
import { Flex, Center, Text, Image, Heading } from "@chakra-ui/react";
import { Button } from "@/components/universal/button";

export function Page() {
  const wg_msi_url = process.env.NEXT_PUBLIC_WG_PC_URL; // 从环境变量获取 API 地址

  return (
    <Center>
      <Flex
        direction="column"
        justifyContent="space-between"
        alignItems="center"
        maxW="460px"
      >
        <Heading size="md" mb={3}>
          下载并安装WG
        </Heading>

        <Button
          size="sm"
          onClick={() => {
            window.open(wg_msi_url, "_blank");
          }}
        >
          点击下载WG安装包
        </Button>

        <Text my={3}>WG全称WireGuard，这是安装成功的图</Text>

        <Image src="/images/msi_img.png" alt="msi_img" />
      </Flex>
    </Center>
  );
}
