"use client";
import { Flex, Text, Box, Heading } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { Button } from "@/components/universal";

export default function Page({ params }: { params: { pageId: string } }) {
  const { pageId } = params;
  const [warnningDisplay, setWarnningDisplay] = useState<string>("none");

  const checkKey = async () => {
    const key = localStorage.getItem("key");
    if (!key) {
      setWarnningDisplay("block");
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL; // 从环境变量获取 API 地址
    const response = await fetch(
      `${apiUrl}/checkKey?key=${encodeURIComponent(key)}`,
      { method: "GET" }
    );
    if (response.ok) {
      const data = await response.json();
      if (data.code === 1) {
        setWarnningDisplay("block");
        localStorage.removeItem("key");
      }
    }
  };

  // 使用 useEffect 在组件加载时调用
  useEffect(() => {
    checkKey();
  }, []); // 空依赖数组表示只在首次加载时调用

  const currentStepIndex = 3;
  return (
    <Flex direction="column" justifyContent="space-between" alignItems="center">
      <Heading mb={4}>电脑教程</Heading>

      <Heading color="yellow" size="md" display={warnningDisplay}>
        你尚未进行身份验证，无法下载
      </Heading>

      <Text mb={4}>content</Text>

      <Box display="flex" justifyContent="space-between">
        {currentStepIndex > 0 && <Button colorScheme="teal">上一步</Button>}
        {currentStepIndex < 10 && <Button colorScheme="teal">下一步</Button>}
      </Box>
    </Flex>
  );
}
