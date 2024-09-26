"use client";

import {
  Flex,
  Box,
  Center,
  List,
  ListItem,
  Image,
  Heading,
} from "@chakra-ui/react";
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
          使用联机房间开始联机
        </Heading>

        <List spacing={2}>
          <ListItem>该页面可判断是否连上了喵服并检测网络延迟</ListItem>
          <ListItem>
            使用创建/加入房间功能，让彼此处于一个联机房间后，就可以像局域网一样联机
          </ListItem>
          <ListItem>
            加入房间需要是房间内的成员才行，否则无法加入，房主可以添加房间成员
          </ListItem>

          {/* <ListItem>下图是联机房间页面截图</ListItem>
          <Box
            border="2px" // 边框宽度
            borderColor="#31b8ce" // 边框颜色
            borderRadius="md" // 边框圆角
            overflow="hidden" // 确保内容不会溢出边框
          >
            <Image src="/images/fangjian.jpg" alt="fangjian" />
          </Box> */}
        </List>
        <Button
          h="40px"
          mt={3}
          size="md"
          bgColor="#992e98"
          onClick={() => {
            router.push("/room");
          }}
        >
          &gt;&gt; 前往联机房间 &lt;&lt;
        </Button>
      </Flex>
    </Center>
  );
}
