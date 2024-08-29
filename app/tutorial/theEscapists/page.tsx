"use client";
import { useRouter } from "next/navigation";
import { Flex, Center, Heading, Text } from "@chakra-ui/react";
import { Button } from "@/components/universal/button";

export default function AndroidPage0() {
  const router = useRouter();

  return (
    <Center>
      <Flex
        direction="column"
        justifyContent="space-between"
        alignItems="center"
        mx={3}
      >
        <Heading size="md" my={5}>
          由于该游戏的联机机制特殊
          <br />
          需要额外工具辅助才能建房
          <br />
          想联机就认真看教程
        </Heading>

        <Text>
          加Q群961793250
          <br />
          群里有机器人给开房提示
        </Text>

        <Button
          mt={5}
          w="160px"
          h="70px"
          bgColor="#c54572"
          fontSize="40px"
          onClick={() => {
            router.push("/tutorial/theEscapists/android/1");
          }}
        >
          安卓
        </Button>

        <Button
          mt={10}
          w="160px"
          h="70px"
          bgColor="#00987a"
          fontSize="40px"
          onClick={() => {
            router.push("/tutorial/theEscapists/ios/1");
          }}
        >
          苹果
        </Button>

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
