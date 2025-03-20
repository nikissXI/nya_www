"use client";

import { Flex, Center, Divider, Text, Image } from "@chakra-ui/react";
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
      >
        <Image src="/images/doNotStarve/lan.png" alt="lan" />
        <Text my={3}>
          玩家都处于一个联机房间后，主机创建多人游戏，客机进浏览游戏，右上角的连接选LAN，然后刷新房间列表即可。
          <br />
          如果搜不到，主机关闭系统防火墙后再试。
        </Text>

        <Divider my={5} />

        <Button
          bgColor="#b23333"
          onClick={() => {
            router.back();
          }}
        >
          返回
        </Button>
      </Flex>
    </Center>
  );
}
