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
        maxW="460px"
      >
        <Text my={3}>玩家都处于一个联机房间后，进游戏点“与好友一起玩游戏”</Text>
        <Image src="/images/l4d2_1.jpg" alt="l4d2_1" />

        <Divider my={5} />

        <Text my={3}>选“创建新战役大厅”，如果其他好友创建了这里能搜到</Text>
        <Image src="/images/l4d2_2.jpg" alt="l4d2_2" />

        <Divider my={5} />

        <Text my={3}>服务器类型选“本地服务器”，然后直接开始游戏</Text>
        <Image src="/images/l4d2_3.jpg" alt="l4d2_3" />

        <Divider my={5} />

        <Text my={3}>
          加入的玩家按波浪键“~”调出控制台，使用命令“connect 房主IP”即可加入
        </Text>

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
