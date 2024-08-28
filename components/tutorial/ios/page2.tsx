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
          下载并安装WG
        </Heading>

        <List spacing={2}>
          <ListItem>准备好外区ID后，跟着下图操作</ListItem>
          <ListItem>看不懂就去看视频教程，有完整操作录屏</ListItem>
          <Image my={3} src="/images/ios_install_wg.jpg" alt="ios_install_wg" />
          </List>
      </Flex>
    </Center>
  );
}
