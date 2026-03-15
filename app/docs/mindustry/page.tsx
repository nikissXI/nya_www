"use client";

import { Icon, Divider, Text, Image, Heading } from "@chakra-ui/react";
import { Button } from "@/components/universal/button";
import DocFlex from "@/components/docs/DocFlex";
import BackButton from "@/components/docs/BackButton";
import { MdTipsAndUpdates } from "react-icons/md";

export default function Page() {
  return (
    <DocFlex>
      <Heading my={3} size="md" textAlign="center">
        教程仍未完善，欢迎加群补充
      </Heading>

      <Text my={1}>
        <Icon as={MdTipsAndUpdates} mr={2} />
        喵服关联QQ群：830268831
      </Text>

      <Text mt={3}>
        <Icon as={MdTipsAndUpdates} mr={2} />
        玩家都处于同个联机房间并在线后，主机进游戏后，打开菜单，创建联机游戏
      </Text>

      <Image
        maxW="400px"
        src="/images/mindustry/mindustry_1.jpg"
        alt="mindustry_1"
      />

      <Text mt={3}>
        <Icon as={MdTipsAndUpdates} mr={2} />
        客机在加入游戏界面，点添加服务器，把主机的喵服联机IP填上去就行
      </Text>
      <Image
        maxW="400px"
        src="/images/mindustry/mindustry_2.jpg"
        alt="mindustry_2"
      />
      <Divider my={5} />

      <BackButton />
    </DocFlex>
  );
}
