"use client";

import { Flex, Center, List, ListItem, Text, Heading } from "@chakra-ui/react";
import { WarningIcon } from "@chakra-ui/icons";
import { Button } from "@/components/universal/button";
import { useRouter } from "next/navigation";

export function Page() {
  const router = useRouter();

  return (
    <Center>
      <Flex
        direction="column"
        justifyContent="space-between"
        alignItems="center"
        maxW="460px"
      >
        <Heading size="md" mb={3}>
          喵服连接教学已完成
          <br />
          下面是联机注意事项
        </Heading>

        <List spacing={2}>
          <ListItem>
            <WarningIcon mr={2} />
            QQ绑定编号后，群昵称会被改成形如“编号（联机IP）”，方便玩家间联机
          </ListItem>
          <ListItem>
            <WarningIcon mr={2} />
            联机请保持网络流畅，可以通过“检测”命令判断网络流畅度，若延迟大于100或丢包代表网络不稳定
          </ListItem>
          <ListItem>
            <WarningIcon mr={2} />
            如果游戏的创建者把游戏放后台，会导致其他玩家无法搜索和加入游戏
          </ListItem>
          <ListItem>
            <WarningIcon mr={2} />
            各系统只要连上喵服就能互相通信，但至于游戏能不能联机得看游戏自己支不支持
          </ListItem>
          <ListItem>
            <Text fontSize="md">
              <WarningIcon mr={2} />
              喵服支持
              <Text as="span" fontWeight="bold" color="#ff6969">
                所有可以填IP直连
              </Text>
              及
              <Text as="span" fontWeight="bold" color="#ff6969">
                大部分搜索加入
              </Text>
              的游戏联机
            </Text>
          </ListItem>
        </List>

        <Button
          h="60px"
          mt={3}
          size="md"
          bgColor="#7242ad"
          onClick={() => {
            router.push("/tutorial");
          }}
        >
          点击查看
          <br />
          游戏联机教程
        </Button>
      </Flex>
    </Center>
  );
}
