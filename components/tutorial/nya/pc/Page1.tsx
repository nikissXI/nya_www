"use client";

import { Flex, Center, Text, Image, Heading, Divider } from "@chakra-ui/react";
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
        <Heading size="sm">
          Windows只支持win10和win11
          <br />
          苹果电脑也行，去下一个WG就行
          <br />
          教程用windows演示（我没Mac）
        </Heading>

        <Divider my={3} />

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

        <Image src="/images/msi_img.jpg" alt="msi_img" />
      </Flex>
    </Center>
  );
}
