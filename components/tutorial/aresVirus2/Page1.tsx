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
          加入者也可以填房主的喵服IP加入，加入的时候房主别把游戏后台
          <br />
          支持安卓、苹果一起联机，电脑只能跟电脑联机
          <br />
          要把前面的序章打完才会解锁联机功能
        </Text>

        <Button
          size="sm"
          onClick={() => {
            window.open(
              "https://www.bilibili.com/video/BV1FLeJeNEq6/",
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
