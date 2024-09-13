"use client";

import { Input, Center, Text, Flex, Heading } from "@chakra-ui/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/universal/button";

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
        `${apiUrl}/numCheck?num=${encodeURIComponent(inputValue)}`
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
    <Flex
      pt={10}
      direction="column"
      justifyContent="space-between"
      alignItems="center"
    >
      <Heading size="md" maxW="80vw">
        通过QQ或编号查询绑定信息
      </Heading>

      <Text pt={3}>小提示：喵服关联群发“查绑”一样效果</Text>

      <Center pt={6}>
        {/* 使用 Flex 组件来对齐输入框和按钮 */}
        <Input
          type="number"
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

      <Text whiteSpace="pre-line" textAlign="left" minW="200px" mt={3}>
        {resultText}
      </Text>

      <Button
        mt={6}
        bgColor="#b23333"
        fontSize="lg"
        onClick={() => {
          router.back(); // 匿名函数路由到 /wgnum
        }}
      >
        返回
      </Button>
    </Flex>
  );
};

export default Page;
