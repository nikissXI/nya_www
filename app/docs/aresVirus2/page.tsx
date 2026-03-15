"use client";

import { Icon, Center, Divider, Text } from "@chakra-ui/react";
import { Button } from "@/components/universal/button";
import { MdTipsAndUpdates } from "react-icons/md";
import DocFlex from "@/components/docs/DocFlex";
import DocLink from "@/components/docs/DocLink";
import BackButton from "@/components/docs/BackButton";

export default function Page() {
  return (
    <DocFlex>
      <DocLink
        linkText="简略视频演示"
        linkUrl="https://www.bilibili.com/video/BV1FLeJeNEq6/"
      />

      <Text my={1}>
        <Icon as={MdTipsAndUpdates} mr={2} />
        喵服关联QQ群：966579113
      </Text>

      <Text my={1}>
        <Icon as={MdTipsAndUpdates} mr={2} />
        要把前面的序章打完才会解锁联机功能，支持安卓、苹果一起联机，PC只能跟PC联机
      </Text>

      <Text my={1}>
        <Icon as={MdTipsAndUpdates} mr={2} />
        玩家都处于同个联机房间并在线后，一个人做主机创建联机副本，另一个人填主机的喵服ip加入，加入的时候主机别切到游戏外
      </Text>

      <Divider my={5} />

      <BackButton />
    </DocFlex>
  );
}
