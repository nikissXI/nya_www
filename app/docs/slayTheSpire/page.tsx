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
        喵服关联QQ群：698892019
      </Text>

      <Text my={1}>
        <Icon as={MdTipsAndUpdates} mr={2} />
        杀戮尖塔2手游移植版官方QQ群：1054949289，因现在移植版联机仍有不少bug，如果喵服均在线后仍无法联机，可以到该群咨询
      </Text>

      <Text mt={3}>
        <Icon as={MdTipsAndUpdates} mr={2} />
        玩家都处于同个联机房间并在线后，主机创建游戏，客机填写主机的喵服IP加入即可。如果电脑做主机时客机无法加入，关闭系统的防火墙后再试
      </Text>

      <Image
        maxW="400px"
        src="/images/slayTheSpire/slayTheSpire_1.jpg"
        alt="slayTheSpire_1"
      />

      <Divider my={5} />

      <BackButton />
    </DocFlex>
  );
}
