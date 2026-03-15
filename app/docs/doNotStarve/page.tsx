"use client";

import { Divider, Text, Image, Icon } from "@chakra-ui/react";
import { Button } from "@/components/universal/button";
import { MdTipsAndUpdates } from "react-icons/md";
import DocFlex from "@/components/docs/DocFlex";
import BackButton from "@/components/docs/BackButton";

export default function Page() {
  return (
    <DocFlex>
      <Text my={1}>
        <Icon as={MdTipsAndUpdates} mr={2} />
        喵服关联QQ群：1028235187
      </Text>

      <Text my={1}>
        <Icon as={MdTipsAndUpdates} mr={2} />
        玩家都处于同个联机房间并在线后，主机创建多人游戏，客机进浏览游戏，右上角的连接选LAN，然后刷新房间列表即可
      </Text>

      <Image src="/images/doNotStarve/lan.png" maxW="400px" alt="lan" />

      <Text my={1}>
        <Icon as={MdTipsAndUpdates} mr={2} />
        如果房间列表搜索不到，按“~”调出控制台，输入命令“c_connect(&quot;主机IP&quot;,10999,&quot;密码&quot;)”，如“c_connect(&quot;100.64.0.1&quot;,10999,&quot;123456&quot;)”
      </Text>
      <Text my={1}>
        <Icon as={MdTipsAndUpdates} mr={2} />
        如果仍然搜不到，主机关闭系统防火墙后再试
      </Text>

      <Divider my={5} />

      <BackButton />
    </DocFlex>
  );
}
