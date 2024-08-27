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
          获取编号并连上喵服
        </Heading>

        <List spacing={2}>
          <ListItem>步骤 1: 运行程序</ListItem>
          <ListItem>步骤 2: 点击右下方的加号</ListItem>
          <ListItem>步骤 3: 点击“填QQ获取”</ListItem>
          <ListItem>步骤 4: 根据提示完成编号导入</ListItem>
          <Image
            my={3}
            src="/images/android_off.jpg"
            alt="android_off"
          />
          <ListItem>步骤 5: 把开关打开连上喵服</ListItem>
          <Image
            my={3}
            src="/images/android_on.jpg"
            alt="android_on"
          />
        </List>
      </Flex>
    </Center>
  );
}
