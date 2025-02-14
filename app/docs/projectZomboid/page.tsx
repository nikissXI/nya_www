"use client";
import { useRouter } from "next/navigation";
import {
  Heading,
  VStack,
  Text,
  Divider,
  Input,
  Flex,
  Center,
  Image,
} from "@chakra-ui/react";
import { Button } from "@/components/universal/button";

export default function AndroidPage0() {
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
          玩家都处于一个联机房间后，主机建立服务器，客机加入服务器，填写的内容看图。
          <br />
          Windows联机如果搜不到，检查是不是系统防火墙的问题。
        </Text>

        <Image
          src="/images/projectZomboid/projectZomboid.jpg"
          alt="projectZomboid"
        />

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
