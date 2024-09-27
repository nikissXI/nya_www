"use client";

import { Flex, Text, Center, Heading } from "@chakra-ui/react";
import { Button } from "@/components/universal/button";
import { useRouter } from "next/navigation";

export function Page() {
  const router = useRouter();
  return (
    <Center>
      <Flex
        direction="column"
        justifyContent="space-between"
        alignItems="center"
        maxW="460px"
      >
        <Heading size="md" mb={3}>
          使用联机房间开始联机
        </Heading>

        <Text mx={5}>
          现在可以返回联机房间界面查看是否连上喵服了
          <br />
          看一看注意事项的内容，或许能带来帮助
          <br />
          喵服关联群的群主就是服主，如果遇到教程解决不了的问题就私聊他
        </Text>

        <Button
          h="40px"
          mt={3}
          size="md"
          bgColor="#992e98"
          onClick={() => {
            router.push("/room");
          }}
        >
          &gt;&gt; 前往联机房间 &lt;&lt;
        </Button>
      </Flex>
    </Center>
  );
}
