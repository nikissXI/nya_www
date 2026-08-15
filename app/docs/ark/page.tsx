"use client";

import { Icon, Divider, Text, Image, Link } from "@chakra-ui/react";
import DocFlex from "@/components/docs/DocFlex";
import BackButton from "@/components/docs/BackButton";
import { MdTipsAndUpdates } from "react-icons/md";

export default function Page() {
  return (
    <DocFlex>
      <Text textAlign="center" my={1}>
        教程尚不完善，这里只有简略的手游联机教程，端游可以找服主一起研究一下
      </Text>

      <Text my={1}>
        <Icon as={MdTipsAndUpdates} mr={2} />
        手游目前还有挺多bug和问题，更多信息可以加QQ群了解更多信息：1093512060
      </Text>

      <Text mt={3}>
        <Icon as={MdTipsAndUpdates} mr={2} />
        玩家都处于同个联机房间并在线后，主机按下图创建游戏，创建完成后要保持在游戏里，否则客机无法加入
      </Text>

      <Image maxW="800px" src="/images/ark/ark_1.webp" alt="ark_1" />

      <Text mt={3}>
        <Icon as={MdTipsAndUpdates} mr={2} />
        客机打开控制台，使用命令加入游戏“admincheat open
        主机的喵服IP”，比如主机的喵服IP是100.64.0.1，那就写“admincheat open
        100.64.0.1”
      </Text>

      <Text mt={3}>
        <Icon as={MdTipsAndUpdates} mr={2} />
        如果客机加入出现连接超时，客机自己开个主机房间，然后再退出来，进单机再输入一次代码就能进了
      </Text>

      <Divider my={5} />

      <BackButton />
    </DocFlex>
  );
}
