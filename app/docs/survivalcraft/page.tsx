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
        喵服关联QQ群：1092247198
      </Text>

      <Text mt={3}>
        <Icon as={MdTipsAndUpdates} mr={2} />
        玩家都处于同个联机房间并在线后，主机创建新游戏，勾选创建服务器，取消勾选需要登录社区（如下图）,然后进到存档世界里
      </Text>

      <Image
        maxW="400px"
        src="/images/survivalcraft/survivalcraft_1.jpg"
        alt="survivalcraft_1"
      />

      <Text mt={3}>
        <Icon as={MdTipsAndUpdates} mr={2} />
        客机点连接服务器，点本地服列表，添加服务器（如下图）,添加后加入即可
      </Text>
      <Image
        maxW="400px"
        src="/images/survivalcraft/survivalcraft_2.jpg"
        alt="survivalcraft_2"
      />
      <Divider my={5} />

      <BackButton />
    </DocFlex>
  );
}
