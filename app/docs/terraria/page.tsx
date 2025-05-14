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
          注：喵服这种组网联机并不太适合这游戏，延迟会略大，最好就是搞个一个月几十块的服务器搭建服务端，体验会更好，而且可以24小时随时玩。可以去雨云（首页的广告）注册个账号买个服务器，如果是通过喵服的链接注册购买服务器可以找我获得技术支持。
        </Text>

        <Divider my={5} />

        <Text my={3}>
          玩家都处于一个联机房间后，主机建房，客机搜索房间或填主机的喵服IP加入就行，默认端口号7777
          <br />
          国际版手游能和端游联机（前提版本号相同），安卓国际版群文件有安装包。
          <br />
          如果Windows做主机，其他人加入不了，检查系统防火墙是否放通了泰拉瑞亚端口。
        </Text>

        <Button
          bgColor="#c1447d"
          onClick={() => {
            window.open(
              "https://www.bilibili.com/video/BV1a64ge6Ecs/",
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
            router.back();
          }}
        >
          返回
        </Button>
      </Flex>
    </Center>
  );
}
