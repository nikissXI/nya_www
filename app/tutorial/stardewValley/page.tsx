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
        maxW="460px"
      >
        <Text my={3}>
          玩家都处于一个联机房间后，房主主持农场（就是创建联机房间），其他玩家填房主的喵服IP加入即可
          <br />
          支持安卓、苹果、Steam一起联机
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

        <Text>
          如果出现无法移动的情况（这是游戏BUG），就拿剑挥一下或者让朋友给你送一个东西
        </Text>

        <Divider my={5} />

        <Text>
          苹果系统玩家如果加入失败，检查星露谷是否有无线数据的权限（在设置里看，如下图），如果没有就无法联机。一般第一次打开游戏会有个网络权限申请弹框，如果没有的话自己还原网络设置让它重新弹。
        </Text>

        <Image src="/images/星露谷ios网络权限.png" alt="星露谷ios网络权限" />

        <Divider my={5} />

        <Text>下图是移动端1.6.X解锁联机模式的方法，搬自官网</Text>

        <Image
          src="/images/星露谷1.6.X移动端解锁联机模式方法.jpg"
          alt="星露谷1.6.X移动端解锁联机模式方法"
        />

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
