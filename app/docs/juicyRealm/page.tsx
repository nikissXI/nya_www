"use client";

import { Icon, Divider, Text } from "@chakra-ui/react";
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
        linkUrl="https://www.bilibili.com/video/BV1z14y1W7ee/"
      />

      <Text my={1}>
        <Icon as={MdTipsAndUpdates} mr={2} />
        喵服关联QQ群：981282876
      </Text>

      <Text my={1}>
        <Icon as={MdTipsAndUpdates} mr={2} />
        支持安卓、苹果、PC一起联机
      </Text>

      <Text my={1}>
        <Icon as={MdTipsAndUpdates} mr={2} />
        玩家都处于同个联机房间并在线后，一个人做主机创建多人游戏，另一个人填主机的喵服ip加入
      </Text>

      <Text my={1}>
        <Icon as={MdTipsAndUpdates} mr={2} />
        注意！！！填的ip是使用喵服联机房间上显示的，不是游戏里显示的那个，对方加入的时候主机别把游戏后台
      </Text>

      <Divider my={5} />

      <BackButton />
    </DocFlex>
  );
}
