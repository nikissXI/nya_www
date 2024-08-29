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
            玩家都处于一个联机房间后，房主使用py工具运行下载的py脚本，如果是iPad就用悬浮窗运行，如果是iPhone就先放后台
          </ListItem>
          <Image
            src="/images/the_escapists_tool_ios.jpg"
            alt="the_escapists_tool_ios"
          />
          <ListItem>
            房主进逃脱者游戏里创建多人游戏后，切到py工具，看看有没有输出“正在持续转发数据包”这句话，同时看看群里机器人有没有发出如下图的提示，如果出现提示就是创建成功了，这个时候房主切回去逃脱者游戏里，其他要加入玩家赶紧搜索（建议在1分钟内搜索，这个时候后台会协助玩家搜索）
          </ListItem>
          <Image
            src="/images/the_escapists_room_create.jpg"
            alt="the_escapists_room_create"
          />
          <ListItem>玩家加入进来后就可以关掉联机工具</ListItem>
        </List>
      </Flex>
    </Center>
  );
}
