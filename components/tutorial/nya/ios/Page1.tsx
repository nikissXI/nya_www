"use client";

import { Flex, Center, List, ListItem, Heading } from "@chakra-ui/react";

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
          准备一个外区ID
        </Heading>

        <List spacing={2}>
          <ListItem>连接喵服用的软件叫WireGuard（简称WG）</ListItem>
          <ListItem>该软件需要外区ID（就是海外苹果账号）才能下载</ListItem>
          <ListItem>
            如果没有外区ID或不知道这是什么，可以礼貌地私聊服主（就是群主）找他借
          </ListItem>
          <ListItem>认真跟着教程操作几分钟就搞完了，耐心点</ListItem>
        </List>
      </Flex>
    </Center>
  );
}
