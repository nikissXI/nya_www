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
          玩家都处于一个联机房间后，进游戏创建或加入就行
          <br />
          对方搜的时候房主别把游戏后台
          <br />
          是用喵服网站的IP去联机，不是游戏里显示的那个！
          <br />
          支持安卓、苹果、Steam一起联机
        </Text>

        <Button
          bgColor="#c1447d"
          onClick={() => {
            window.open(
              "https://www.bilibili.com/video/BV1z14y1W7ee/",
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
