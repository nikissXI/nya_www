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
          注意：电脑端不支持与移动端联机
          <br />
          玩家都处于一个联机房间后
          <br />
          1、玩家进入游戏，在开始菜单，点击“多人游戏”
          <br />
          2、主机点击“创建服务器”，创建完成后等待
          <br />
          3、客机点击“加入服务器”，即可看到主机所创服务器，选中后点击加入即可
          <br />
          4、待客机加入完毕后，主机点击“开始游戏”即可
          <br />
          Windows联机如果搜不到，检查是不是系统防火墙的问题。如有其他问题加Q群689358384
        </Text>

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
