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
          玩家都处于一个联机房间后，在局域网联机模式填主机IP加入就行
          <br />
          对方搜的时候房主别把游戏后台
          <br />
          只要版本相同可以跨系统联机
          <br />
          详细教程待补充
        </Text>

        <Divider my={5} />

        <Button
          bgColor="#b23333"
          onClick={() => {
            router.push(`/docs`);
          }}
        >
          返回
        </Button>
      </Flex>
    </Center>
  );
}
