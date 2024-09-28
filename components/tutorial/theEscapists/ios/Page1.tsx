"use client";

import {
  Flex,
  Center,
  List,
  ListItem,
  Image,
  Text,
  Link,
  Heading,
} from "@chakra-ui/react";
import { Button } from "@/components/universal/button";
import { useState, useEffect, useCallback } from "react";
import { openToast } from "@/components/universal/toast";

export function Page() {
  const tool_py_url = process.env.NEXT_PUBLIC_TOOL_PY_URL as string; // 从环境变量获取 API 地址
  const [pyText, setpytext] = useState("");
  const [copyButtonText, setButtonText] = useState("点击复制脚本到剪切板");

  const fetchData = useCallback(async () => {
    try {
      const resp = await fetch(tool_py_url);
      if (resp.ok) {
        setpytext(await resp.text());
      }
    } catch (err) {
      openToast({ content: String(err) });
    }
  }, [tool_py_url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCopy = async () => {
    try {
      if (pyText) {
        if (navigator.clipboard && navigator.permissions) {
          await navigator.clipboard.writeText(pyText);
          setButtonText("已复制到剪切板");
        } else {
          throw new Error("不支持自动复制");
        }
      } else {
        throw new Error("脚本内容下载失败");
      }
    } catch (err) {
      openToast({ content: String(err) });
      setButtonText("复制失败");
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

          {copyButtonText === "点击复制脚本到剪切板" ? (
            ""
          ) : (
            <Text fontSize="lg" my={3}>
              如果复制失败就手动复制吧
              <br />
              <Link my={3} color="#7dfffe" href={tool_py_url} isExternal>
                点击查看脚本文件
              </Link>
            </Text>
          )}

          <ListItem>打开py工具，把脚本内容粘贴进去</ListItem>

          <ListItem>服主没苹果设备，所以没法录视频教程</ListItem>
        </List>
      </Flex>
    </Center>
  );
}
