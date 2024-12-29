"use client";

import { Text, VStack, Heading, Box } from "@chakra-ui/react";
import { Button } from "@/components/universal/button";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    <VStack spacing={6}>
      <Box textAlign="center">
        <Text>
          视频教程更新不太及时
          <br />
          请以图文教程为准
        </Text>
        <Button
          // py={7}
          // px={3}
          size="md"
          bgColor="#c54572"
          // fontSize="30px"
          onClick={() => {
            window.open(
              "https://www.bilibili.com/video/BV1MK4y1s7mS",
              "_blank"
            );
          }}
        >
          视频教程
        </Button>
      </Box>

      <Heading size="md" textAlign="center">
        请选择对应系统
        <br />
        查看图文教程
      </Heading>

      <Button
        p={7}
        bgColor="#148f14"
        fontSize="30px"
        onClick={() => {
          router.push("/tutorial/nya/android");
        }}
      >
        安卓
      </Button>

      <Button
        p={7}
        bgColor="#2383c2"
        fontSize="30px"
        onClick={() => {
          router.push("/tutorial/nya/ios");
        }}
      >
        苹果
      </Button>

      <Button
        p={7}
        bgColor="#753030"
        fontSize="30px"
        onClick={() => {
          router.push("/tutorial/nya/pc");
        }}
      >
        电脑
      </Button>

      <Button
        size="lg"
        variant="link"
        bgColor="transparent"
        onClick={() => {
          router.push("/room");
        }}
      >
        返回
      </Button>
    </VStack>
  );
}
