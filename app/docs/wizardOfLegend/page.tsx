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
          玩家都处于一个联机房间后，进游戏创建或加入就行
          <br />
          客机加入的时候主机别把游戏后台
          <br />
          支持安卓、苹果一起联机，不支持电脑（传说法师1电脑版没有联机模式，2才有）
        </Text>

        <Button
          bgColor="#c1447d"
          onClick={() => {
            window.open(
              "https://www.bilibili.com/video/BV1svije6Eda/",
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
