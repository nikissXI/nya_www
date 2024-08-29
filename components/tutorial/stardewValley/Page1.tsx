"use client";

import { Flex, Center, Text } from "@chakra-ui/react";
import { Button } from "@/components/universal/button";

export function Page() {
  return (
    <Center>
      <Flex
        direction="column"
        justifyContent="space-between"
        alignItems="center"
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
          size="sm"
          onClick={() => {
            window.open(
              "https://www.bilibili.com/video/BV1U1eGe8Eka/",
              "_blank"
            );
          }}
        >
          点击查看视频教程
        </Button>
      </Flex>
    </Center>
  );
}
