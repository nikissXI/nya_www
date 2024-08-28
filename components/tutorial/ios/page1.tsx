"use client";
import {
  Flex,
  Center,
  List,
  ListItem,
  Image,
  Heading,
  Text,
} from "@chakra-ui/react";
import { Button } from "@/components/universal/button";

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
            如果没有外区ID或不知道这是什么，可以礼貌地私聊群主找他借
          </ListItem>
        </List>
      </Flex>
    </Center>
  );
}
