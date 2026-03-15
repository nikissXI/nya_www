"use client";

import { Icon, Divider, Text, Heading } from "@chakra-ui/react";
import { Button } from "@/components/universal/button";
import DocFlex from "@/components/docs/DocFlex";
import DocLink from "@/components/docs/DocLink";
import BackButton from "@/components/docs/BackButton";
import { MdTipsAndUpdates } from "react-icons/md";

export default function Page() {
  return (
    <DocFlex>
      <Heading size="lg" textAlign="center">
        仅手游，PC不支持联机
      </Heading>

      <DocLink
        linkText="视频演示"
        linkUrl="https://www.bilibili.com/video/BV1svije6Eda/"
      />

      <Text my={1}>
        <Icon as={MdTipsAndUpdates} mr={2} />
        喵服关联QQ群：981286541
      </Text>

      <Text my={1}>
        <Icon as={MdTipsAndUpdates} mr={2} />
        玩家都处于同个联机房间并在线后，主机进游戏创建联机房间，创建好后不要切出游戏外，客机进游戏点加入房间搜索即可
      </Text>

      <Divider my={5} />

      <BackButton />
    </DocFlex>
  );
}
