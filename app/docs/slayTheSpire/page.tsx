"use client";

import { Icon, Divider, Text, Image, Link } from "@chakra-ui/react";
import { Button } from "@/components/universal/button";
import DocLink from "@/components/docs/DocLink";
import DocFlex from "@/components/docs/DocFlex";
import BackButton from "@/components/docs/BackButton";
import { MdTipsAndUpdates } from "react-icons/md";

export default function Page() {
  return (
    <DocFlex>
      <DocLink
        linkText="杀戮尖塔2手游移植版获取方式"
        linkUrl="https://space.bilibili.com/116375500/dynamic"
      />

      <Text my={1}>
        <Icon as={MdTipsAndUpdates} mr={2} />
        喵服关联QQ群：698892019 群文件也提供杀戮尖塔2手游下载
      </Text>

      <Text mt={3}>
        <Icon as={MdTipsAndUpdates} mr={2} />
        该游戏联机建议使用节点STS，专门为这游戏开的
      </Text>

      <Text mt={3}>
        <Icon as={MdTipsAndUpdates} mr={2} />
        喵服联机与联机大厅mod有冲突，用喵服的时候把大厅mod关掉
      </Text>

      <Text mt={3}>
        <Icon as={MdTipsAndUpdates} mr={2} />
        如果用喵服，某一位是端游则需要装联机mod（创意工坊里找的DirectConnectIP，换其他的也可以）
        <Link
          ml={1}
          color="#7dd4ff"
          href="/apks/联机补丁mod.zip"
          target="_blank"
        >
          点我下载
        </Link>
        <br />
        装联机mod后，手游需要进游戏设置把本地联机补丁关掉（如下图）。如果全部人都是手游，不需要另外装mod，直接游戏里填IP加入就行（手游内置联机mod并默认开启）。
      </Text>

      <Image
        maxW="400px"
        src="/images/slayTheSpire/slayTheSpire_2.jpg"
        alt="slayTheSpire_2"
      />

      <Text mt={3}>
        <Icon as={MdTipsAndUpdates} mr={2} />
        上述情况没问题后，玩家都处于同个联机房间并在线后，主机创建游戏，客机填写主机的喵服IP加入即可。如果Windows做主机时客机无法加入，关闭系统的防火墙后再试
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
