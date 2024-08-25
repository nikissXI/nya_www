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
  const [resultText, setResultText] = useState<string>("");
  const [buttonText, setButtonText] = useState<string>("提交");
  const [textColor, setTextColor] = useState<string>("white");
  const [showTutorial, setShowTutorial] = useState<string>("none");

  const handleSubmit = async () => {
    try {
      setResultText("请求中。。。");
      setTextColor("white");
      setShowTutorial("none");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL; // 从环境变量获取 API 地址
      const response = await fetch(
        `${apiUrl}/submitQQ?qq=${encodeURIComponent(inputValue)}`,
        { method: "GET", credentials: "include" }
      );
      if (!response.ok) {
        throw new Error("发送请求出错");
      }
      const data = await response.json();
      if (data.code === 1) {
        setButtonText("下一步");
      } else {
        setButtonText("提交");
      }
      if (data.code === 99) {
        setTextColor("#ff5353");
      } else if (data.code === 2) {
        localStorage.setItem("key", data.key);
        setShowTutorial("Flex");
      }
      setResultText(data.msg);
    } catch (err) {
      setResultText(err instanceof Error ? err.message : "发送请求出错");
    }
  };

  // 处理输入框变化
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  return (
    <Box pt={10} textAlign="center">
      <Center>
        <Heading maxW="80vw">每个QQ可以绑定一个编号</Heading>
      </Center>

      <Center>
        <Text pt={3}>请跟随提示进行操作</Text>
      </Center>

      <Center pt={6}>
        {/* 使用 Flex 组件来对齐输入框和按钮 */}
        <Input
          bgColor="#000c1975"
          placeholder="请输入QQ号"
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
          {buttonText}
        </Button>
      </Center>

      <Center>
        <Text
          color={textColor}
          whiteSpace="pre-line"
          textAlign="left"
          minW="200px"
          mt={3}
        >
          {resultText}
        </Text>
      </Center>

      <Center>
        <Button
          display={showTutorial}
          color="#80ffaf"
          mt={5}
          bgColor="#2d85c980"
          fontSize="md"
          onClick={() => {
            router.push("/tutorial");
          }}
        >
          &gt; 点击跳转教程页面 &lt;
        </Button>
      </Center>

      <Center>
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
      </Center>
    </Box>
  );
};

export default Page;
