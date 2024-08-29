"use client";

import {
  Flex,
  Center,
  List,
  ListItem,
  Image,
  Heading,
} from "@chakra-ui/react";

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
          检测是否成功连上喵服
        </Heading>

        <List spacing={2}>
          <ListItem>通过命令“检测”可以检测是否连上</ListItem>
          <ListItem>我的编号是20，就在群里发“检测20”，注意不要带空格</ListItem>
          <Image
            my={3}
            src="/images/wg_check.jpg"
            alt="wg_check"
          />
          <ListItem>该命令也可以检测其他人是否连上</ListItem>
          <ListItem>把编号改成要检测的就行</ListItem>
        </List>
      </Flex>
    </Center>
  );
}
