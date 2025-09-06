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
      >
        <Text my={3}>
          建议使用贝瑞蒲公英联机平台（紫色图标的），那个更容易使用
          <br />
          玩家都处于一个联机房间后，一个人做主机，另一个人填ip加入就行
          <br />
          加入的ip是使用喵服联机房间上显示的，不是游戏里显示的那个，对方加入的时候主机别把游戏后台
          <br />
          支持安卓、苹果、PC一起联机
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
          点击查看视频演示<br/>仅作辅助，图文还是得看
        </Button>

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
