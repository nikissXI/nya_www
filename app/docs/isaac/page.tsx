"use client";

import { Flex, Center, Divider, Text } from "@chakra-ui/react";
import { Button } from "@/components/universal/button";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    <Center>
      <Flex
        direction="column"
        justifyContent="space-between"
        alignItems="center"
        mb={5}
        mx="5vw"
      >
        <Text my={3}>
          教程由B站UP主Winters_Stone1制作，请点击按钮跳转到B站观看视频教程
        </Text>

        <Button
          bgColor="#c1447d"
          onClick={() => {
            window.open(
              "https://www.bilibili.com/video/BV1dZSeBLE4e/",
              "_blank"
            );
          }}
        >
          点击跳转至B站
        </Button>

        <Divider my={5} />

        <Button
          bgColor="#b23333"
          onClick={() => {
            router.back();
          }}
        >
          返回
        </Button>
      </Flex>
    </Center>
  );
}
