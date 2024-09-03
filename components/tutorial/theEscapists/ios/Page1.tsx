"use client";

import {
  Flex,
  Text,
  Center,
  List,
  ListItem,
  Image,
  Link,
  Heading,
} from "@chakra-ui/react";
import { Button } from "@/components/universal/button";
import { useState } from "react";

export function Page() {
  const tool_py_url = process.env.NEXT_PUBLIC_TOOL_PY_URL as string; // 从环境变量获取 API 地址
  const [displayLink, setDisplayLink] = useState<boolean>(true);
  const [copyButtonText, setButtonText] =
    useState<string>("点击复制脚本到剪切板");

  const handleCopy = async () => {
    try {
      const resp = await fetch(tool_py_url);
      if (!resp.ok) {
        setButtonText("复制失败，请访问链接复制");
        setDisplayLink(false);
      } else {
        const py_text = await resp.text();
        setButtonText("复制中...");
        setTimeout(() => {
          navigator.clipboard.writeText(py_text);
        }, 1000);
        setButtonText("已复制到剪切板");
        setTimeout(() => {
          setButtonText("点击复制脚本到剪切板");
        }, 3000);
      }
    } catch (err) {
      setButtonText("复制失败，请访问链接复制");
      setDisplayLink(false);
    }
  };

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

          <ListItem>
            然后复制脚本
            <Button ml={3} size="sm" onClick={handleCopy}>
              {copyButtonText}
            </Button>
          </ListItem>

          <Link hidden={displayLink} my={3} href={tool_py_url} isExternal>
            点击下载脚本文件
          </Link>

          <ListItem>打开py工具，把脚本内容粘贴进去</ListItem>

          <ListItem>服主没苹果设备，所以没法录视频教程</ListItem>
        </List>
      </Flex>
    </Center>
  );
}
