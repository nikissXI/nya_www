"use client";

import { Icon, Divider, Text, Heading } from "@chakra-ui/react";
import DocFlex from "@/components/docs/DocFlex";
import BackButton from "@/components/docs/BackButton";
import { MdTipsAndUpdates } from "react-icons/md";

export default function Page() {
  return (
    <DocFlex>
      <Text my={1}>
        <Icon as={MdTipsAndUpdates} mr={2} />
        玩家都处于同个联机房间并在线后，直接进游戏联机即可，无需另外开加速器
      </Text>

      <Text textAlign="center">
        联机流量不一定100%能走喵服，如果使用喵服后还是觉得卡顿，可以加群找服主问问
      </Text>

      <Divider my={5} />

      <BackButton />
    </DocFlex>
  );
}
