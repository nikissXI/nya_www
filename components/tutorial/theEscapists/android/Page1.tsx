"use client";

import { Flex, Center, Text, Heading } from "@chakra-ui/react";
import { Button } from "@/components/universal/button";

export function Page() {
  const tool_url = process.env.NEXT_PUBLIC_TOOL_URL; // 从环境变量获取 API 地址

  return (
    <Center>
      <Flex
        direction="column"
        justifyContent="space-between"
        alignItems="center"
        maxW="460px"
      >
        <Heading size="md" mb={3}>
          下载逃脱者联机开房工具
        </Heading>

        <Button
          size="sm"
          onClick={() => {
            window.open(tool_url, "_blank");
          }}
        >
          点击下载联机工具安装包
        </Button>

        <Text my={3}>
          这个工具只需要逃脱者的房主运行，其他人直接搜就行，有视频教程
        </Text>

        <Button
          size="sm"
          onClick={() => {
            window.open("https://b23.tv/2dcjPHv", "_blank");
          }}
        >
          点击查看视频教程
        </Button>
      </Flex>
    </Center>
  );
}
