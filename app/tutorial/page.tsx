"use client";

import { Center, Box, VStack, Heading } from "@chakra-ui/react";
import { Button } from "@/components/universal/button";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    <VStack spacing={6}>
      <Heading>请选择系统</Heading>
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
