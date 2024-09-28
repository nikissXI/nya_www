"use client";
import { useRouter } from "next/navigation";
import { VStack, Text } from "@chakra-ui/react";
import { Button } from "@/components/universal/button";

export default function AndroidPage0() {
  const router = useRouter();

  return (
    <VStack spacing={6}>
      <Text>
        由于该游戏的联机机制特殊
        <br />
        需要额外工具辅助才能建房
        <br />
        想联机就认真看教程
      </Text>

      <Text>
        加Q群961793250
        <br />
        群里有机器人给开房提示
        <br />
        支持安卓和苹果联机
      </Text>

      <Button
        p={7}
        bgColor="#148f14"
        fontSize="30px"
        onClick={() => {
          router.push("/tutorial/theEscapists/android/1");
        }}
      >
        安卓
      </Button>

      <Button
        p={7}
        bgColor="#2383c2"
        fontSize="30px"
        onClick={() => {
          router.push("/tutorial/theEscapists/ios/1");
        }}
      >
        苹果
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
