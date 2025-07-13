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
          玩家都处于一个联机房间后，主机创建局域网游戏或运行服务端，其他人填主机的喵服IP搜索就行。
          <br />
          Java版默认端口号25565，非默认端口号则在IP后面加上端口号，IP和端口号之间用的是英文的冒号，比如搜索IP是8.8.8.8，端口号是1234，那么填写的IP地址应该是8.8.8.8:1234
          <br />
          Bedrock版默认端口号19132，非默认端口号则正确填写端口号
          <br />
          Windows做主机如果加入失败，关闭系统防火墙再试。
          <br />
          基岩和Java都可以用，但想互通得靠第三方mod或插件，网上自己找教程。
          <br />
          如果能搜到但加入失败，那就自己搜报错解决，只要能搜索到就不是喵服的问题了。
        </Text>
        <Button
          bgColor="#c1447d"
          onClick={() => {
            window.open(
              "https://www.bilibili.com/video/BV1UX4GegEAf/",
              "_blank"
            );
          }}
        >
          点击查看视频演示
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
