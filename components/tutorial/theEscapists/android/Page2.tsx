"use client";

import { Flex, Center, List, ListItem, Image, Heading } from "@chakra-ui/react";

export function Page() {
  return (
    <Center>
      <Flex
        direction="column"
        justifyContent="space-between"
        alignItems="center"
        maxW="460px"
      >
        <Heading size="md" mb={3}>
          创建和加入
        </Heading>

        <List spacing={2}>
          <ListItem>
            玩家都处于一个联机房间后，房主跟着联机工具的提示操作就行（如下图）
          </ListItem>
          <Image
            src="/images/the_escapists_tool.png"
            alt="the_escapists_tool"
          />

          <ListItem>
            如果房主创建房间成功，群里的机器人会发出如下图的提示，这个时候其他要加入玩家赶紧搜索（建议在1分钟内搜索，这个时候后台会协助玩家搜索），房主的游戏不要后台否则其他人搜不到
          </ListItem>
          <Image
            src="/images/the_escapists_room_create.png"
            alt="the_escapists_room_create"
          />
          <ListItem>玩家加入进来后就可以关掉联机工具</ListItem>
        </List>
      </Flex>
    </Center>
  );
}
