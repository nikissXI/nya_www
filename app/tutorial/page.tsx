"use client";

import { Center, Box, VStack, Heading } from "@chakra-ui/react";
import { Button } from "@/components/universal/button";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    <VStack spacing={6}>
      <Button
        py={7}
        px={3}
        bgColor="#c54572"
        fontSize="30px"
        onClick={() => {
          window.open("https://www.bilibili.com/video/BV1MK4y1s7mS", "_blank");
        }}
      >
        视频教程
      </Button>

      <Heading>请选择系统</Heading>

      <Button
        p={7}
        bgColor="#148f14"
        fontSize="30px"
        onClick={() => {
          router.push("/tutorial/nya/android/1");
        }}
      >
        安卓
      </Button>

      <Button
        p={7}
        bgColor="#2383c2"
        fontSize="30px"
        onClick={() => {
          router.push("/tutorial/nya/ios/1");
        }}
      >
        苹果
      </Button>

      <Button
        p={7}
        bgColor="#753030"
        fontSize="30px"
        onClick={() => {
          router.push("/tutorial/nya/pc/1");
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
