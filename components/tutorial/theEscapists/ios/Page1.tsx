"use client";

import {
  Flex,
  Center,
  List,
  ListItem,
  Image,
  Heading,
} from "@chakra-ui/react";
import { Button } from "@/components/universal/button";

export function Page() {
  const tool_py_url = process.env.NEXT_PUBLIC_TOOL_PY_URL; // 从环境变量获取 API 地址

  return (
    <Center>
      <Flex
        direction="column"
        justifyContent="space-between"
        alignItems="center"
        maxW="460px"
      >
        <Heading size="md" mb={3}>
          联机工具准备
        </Heading>

        <List spacing={2}>
          <ListItem>这个工具只需要逃脱者的房主运行，其他人直接搜就行</ListItem>
          <ListItem>
            教程里用的是“Python Editor APP”（简称py工具），去App
            Store下载安卓就行（如果你懂python你用其他类似的软件也可以）
          </ListItem>
          <Image
            src="/images/the_escapists_tool_py.jpg"
            alt="the_escapists_tool_py"
          />

          <ListItem>然后下载这个py脚本</ListItem>
          <Button
            size="sm"
            onClick={() => {
              window.open(tool_py_url, "_blank");
            }}
          >
            点击下载py脚本
          </Button>
          <ListItem>服主没苹果设备，所以没法录视频教程</ListItem>
          </List>
      </Flex>
    </Center>
  );
}
