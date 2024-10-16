"use client";

import { Flex, Center, Divider, Text } from "@chakra-ui/react";
import { Button } from "@/components/universal/button";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    <Center>
      <Flex
        direction="column"
        justifyContent="space-between"
        alignItems="center"
        mb={5}
        mx="5vw"
        maxW="460px"
      >
        <Text my={3}>
          玩家都处于一个联机房间后，在局域网联机模式建房或搜房就行
          <br />
          对方搜的时候房主别把游戏后台
          <br />
          支持安卓、苹果一起联机
        </Text>

        <Divider my={5} />

        <Button
          bgColor="#b23333"
          onClick={() => {
            router.push(`/room`);
          }}
        >
          返回
        </Button>
      </Flex>
    </Center>
  );
}
