"use client";

import { Input, Center, Text, Flex, Heading } from "@chakra-ui/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/universal/button";
import { useAuth } from "@/components/universal/AuthContext";

const Page = () => {
  const router = useRouter();
  const [inputValue, setInputValue] = useState<string>("");
  const [resultText, setResultText] = useState<string>("");
  const [buttonText, setButtonText] = useState<string>("提交");
  const [textColor, setTextColor] = useState<string>("white");
  const [showTutorial, setShowTutorial] = useState<string>("none");
  const { toggleLogin } = useAuth();

  const handleSubmit = async () => {
    try {
      setResultText("请求中。。。");
      setTextColor("white");
      setShowTutorial("none");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL; // 从环境变量获取 API 地址
      const response = await fetch(
        `${apiUrl}/submitQQ?qq=${encodeURIComponent(inputValue)}`
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
        toggleLogin(true);
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
    <Flex
      pt={10}
      direction="column"
      justifyContent="space-between"
      alignItems="center"
    >
      <Heading size="md" maxW="80vw">
        请通过QQ进行身份验证
      </Heading>
      <Text py={5}>
        1、如果QQ未绑定编号将自动绑定新编号
        <br />
        2、QQ需留在任一喵服关联群否则会解绑
        <br />
        3、一个编号不能同时用于多个设备
        <br />
        4、一个QQ只能绑定一个编号
      </Text>
      请跟随提示进行操作
      <Center pt={2}>
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
      <Text
        color={textColor}
        whiteSpace="pre-line"
        textAlign="left"
        minW="200px"
        mt={3}
      >
        {resultText}
      </Text>
      <Button
        display={showTutorial}
        mt={5}
        bgColor="#31c92d80"
        fontSize="md"
        onClick={() => {
          router.push("/tutorial");
        }}
      >
        &gt; 点击跳转教程页面 &lt;
      </Button>
      <Button
        mt={6}
        bgColor="#b23333"
        fontSize="lg"
        onClick={() => {
          router.back();
        }}
      >
        返回
      </Button>
    </Flex>
  );
};

export default Page;
