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
      >
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
        <Text my={3}>
          下方图文教程用安卓国际版演示，其他平台的类似（自己摸索一下）
        </Text>
        <Text mt={3}>
          进入多人模式，选择玩家（如果没有就新建），然后点开始游戏
        </Text>
        <Image src="/images/terraria/terraria_1.jpg" alt="terraria_1" />
        <Text mt={3}>
          这个界面大部分时候是搜索不到的，别在这傻等。如果你要做主机，就点右下角的“+主机”
        </Text>
        <Image src="/images/terraria/terraria_2.jpg" alt="terraria_2" />
        <Text mt={3}>然后选择地图（如果没有就新建）</Text>
        <Image src="/images/terraria/terraria_3.jpg" alt="terraria_3" />
        <Text mt={3}>客机（加入的）点这个，然后点右下角的“+添加”</Text>
        <Image src="/images/terraria/terraria_4.jpg" alt="terraria_4" />
        <Text mt={3}>填主机的喵服IP，端口号默认7777就行，然后点开始游戏</Text>
        <Image src="/images/terraria/terraria_5.jpg" alt="terraria_5" />

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
