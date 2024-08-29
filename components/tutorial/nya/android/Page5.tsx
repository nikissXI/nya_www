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
          创建和加入房间
        </Heading>

        <List spacing={2}>
          <ListItem>
            创建房间使用命令“创建”，该命令的详细用法可以通过发送“创建”了解
          </ListItem>
          <Image my={3} src="/images/chuanjian.jpg" alt="chuanjian" />
          <ListItem>如要与1号和2号联机，就发命令“创建1 2”</ListItem>
          <Image
            my={3}
            src="/images/chuangjianMember.jpg"
            alt="chuangjianMember"
          />
          <ListItem>房间成员使用命令“加入”进入房间</ListItem>
          <Image my={3} src="/images/jiaru.jpg" alt="chuangjianMember" />
        </List>
      </Flex>
    </Center>
  );
}
