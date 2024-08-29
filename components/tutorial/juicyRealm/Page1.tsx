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
          玩家都处于一个联机房间后，进游戏创建或加入就行
          <br />
          对方搜的时候房主别把游戏后台
          <br />
          游戏里面显示的那个IP用不上，不用管
          <br />
          支持安卓、苹果、Steam一起联机
        </Text>

        <Button
          size="sm"
          onClick={() => {
            window.open(
              "https://www.bilibili.com/video/BV1z14y1W7ee/",
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
