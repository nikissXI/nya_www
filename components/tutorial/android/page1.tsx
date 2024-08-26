"use client";
import { useRouter } from "next/navigation";
import {
  Flex,
  Center,
  Stack,
  Text,
  Box,
  Button,
  Heading,
} from "@chakra-ui/react";
import { useState } from "react";

export default function AndroidPage1() {
  const router = useRouter();

  const [showXM, setShowXM] = useState(false);

  const toggleText = () => {
    setShowXM(!showXM);
  };

  return (
    <Flex direction="column" justifyContent="space-between" alignItems="center">
      <Center>
        <Stack spacing={10} w="160px">
          <Box>
            <Text>小米/红米手机的点击查看，不是请忽略</Text>
            <Button onClick={toggleText} bgColor="#ff7a00">
              {showXM ? "隐藏文本" : "小米手机"}
            </Button>
            {showXM && (
              <Text>
                找到系统的游戏加速，打开加速设置-&gt;性能增强-&gt;性能增强-&gt;把“WLAN网络优化”关闭，如下图
                这个东西默认是开启的，需要关掉，否则会导致无法联机，关掉后最好再重启一下手机
              </Text>
            )}
          </Box>
          
          <Button
            h="70px"
            bgColor="#148f14"
            fontSize="40px"
            variant="solid"
            onClick={() => {
              router.push("/tutorial/android/0");
            }}
          >
            视频
          </Button>

          <Button
            h="70px"
            bgColor="#2383c2"
            fontSize="40px"
            variant="solid"
            onClick={() => {
              router.push("/tutorial/ios");
            }}
          >
            图文
          </Button>
        </Stack>
      </Center>
    </Flex>
  );
}
