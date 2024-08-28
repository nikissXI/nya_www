"use client";
import { useRouter } from "next/navigation";
import { Flex, Center, Text, Box, Image } from "@chakra-ui/react";
import { Button } from "@/components/universal/button";
import { useState } from "react";
import HeadingText from "@/components/tutorial/TutorialHeading";

export default function AndroidPage0() {
  const router = useRouter();

  const [showXM, setShowXM] = useState(false);

  const toggleText = () => {
    setShowXM(!showXM);
  };

  return (
    <Center>
      <Flex
        direction="column"
        justifyContent="space-between"
        alignItems="center"
        mx={3}
      >
        <HeadingText />

        <Button
          mt={10}
          w="160px"
          h="70px"
          bgColor="#c54572"
          fontSize="40px"
          onClick={() => {
            window.open(
              "https://www.bilibili.com/video/BV1MK4y1s7mS?p=1",
              "_blank"
            );
          }}
        >
          视频
        </Button>

        <Button
          mt={10}
          w="160px"
          h="70px"
          bgColor="#00987a"
          fontSize="40px"
          onClick={() => {
            router.push("/tutorial/android/1");
          }}
        >
          图文
        </Button>

        <Button
          mt={10}
          onClick={toggleText}
          bgColor="#d46500"
          size="sm"
          w="160px"
          h="40px"
        >
          {showXM ? (
            "点击收起"
          ) : (
            <Text>
              如果是小米/红米用户
              <br />
              请点我，不是请忽略
            </Text>
          )}
        </Button>
        {showXM && (
          <Box maxW="600px">
            <Text>
              MIUI的加速会拦截VPN流量，具体现象就是不进游戏没事，一进游戏就掉线
              <br />
              具体操作：找到系统的游戏加速，打开加速设置-&gt;性能增强-&gt;性能增强-&gt;把“WLAN网络优化”关闭
              <br />
              如下图（系统版本不同可能不一样，脑子灵活点）
            </Text>
            <Image src="/images/xiaomi.jpg" alt="xiaomi" borderRadius="md" />
          </Box>
        )}

        <Button
          mt={10}
          size="sm"
          bgColor="#b23333"
          onClick={() => {
            router.push("/tutorial");
          }}
        >
          返回
        </Button>
      </Flex>
    </Center>
  );
}
