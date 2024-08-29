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
          加入的时候房主别把游戏后台
          <br />
          支持安卓、苹果一起联机
        </Text>

        <Button
          size="sm"
          onClick={() => {
            window.open(
              "https://www.bilibili.com/video/BV1svije6Eda/",
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
