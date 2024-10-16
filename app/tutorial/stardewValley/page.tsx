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
          玩家都处于一个联机房间后，房主主持农场（就是创建联机房间），其他玩家填房主的喵服IP加入即可
          <br />
          加入的时候房主别把游戏后台
          <br />
          只能安卓和安卓联机，电脑和电脑联机
        </Text>

        <Button
          bgColor="#c1447d"
          onClick={() => {
            window.open(
              "https://www.bilibili.com/video/BV1U1eGe8Eka/",
              "_blank"
            );
          }}
        >
          点击查看视频教程
        </Button>

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
