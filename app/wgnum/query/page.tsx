"use client";

import {
  Input,
  Center,
  InputGroup,
  Text,
  Box,
  InputRightElement,
  Button,
  Stack,
  Heading,
} from "@chakra-ui/react";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const [inputValue, setInputValue] = useState<string>("");
  const [resultText, setresultText] = useState<string>("");

  // 处理输入框变化
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL; // 从环境变量获取 API 地址
      const response = await fetch(
        `${apiUrl}/num_check?num=${encodeURIComponent(inputValue)}`
      );
      if (!response.ok) {
        throw new Error("发送请求出错");
      }
      const data = await response.text();
      setresultText(data);
    } catch (err) {
      setresultText(err instanceof Error ? err.message : "发送请求出错");
    }
  };

  return (
    <Box pt={10} textAlign="center">
      <Center>
        <Heading maxW="80vw">这里可以通过QQ或编号查询绑定信息</Heading>
      </Center>

      <Center>
        <Text pt={3}>小提示：喵服关联群发“查绑”一样效果</Text>
      </Center>

      <Center pt={6}>
        {/* 使用 Flex 组件来对齐输入框和按钮 */}
        <Input
          bgColor="#000c1975"
          placeholder="请输入QQ或编号"
          value={inputValue}
          onChange={handleInputChange}
          maxW="240px"
          mr={1} // 设置右边距，以便输入框和按钮之间有间隔
        />
        <Button
          bgColor="#0075ff"
          onClick={handleSubmit}
          isDisabled={!inputValue} // 当输入框为空时禁用按钮
        >
          提交
        </Button>
      </Center>

      <Center>
        <Text whiteSpace="pre-line" textAlign="left" minW="200px" mt={3}>
          {resultText}
        </Text>
      </Center>

      <Button
        color="#ff4d4d"
        mt={6}
        bgColor="#2d85c980"
        fontSize="lg"
        onClick={() => {
          router.back(); // 匿名函数路由到 /wgnum
        }}
      >
        返回上一级
      </Button>
    </Box>
  );
};

export default Page;
