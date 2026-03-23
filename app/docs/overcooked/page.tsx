"use client";

import { Icon, Divider, Text, Heading } from "@chakra-ui/react";
import DocFlex from "@/components/docs/DocFlex";
import BackButton from "@/components/docs/BackButton";
import { MdTipsAndUpdates } from "react-icons/md";

export default function Page() {
  return (
    <DocFlex>
      <Heading size="lg" textAlign="center">
        对，就这么简单
      </Heading>

      <Text my={1}>
        <Icon as={MdTipsAndUpdates} mr={2} />
        玩家都处于同个联机房间并在线后，直接进游戏联机即可，无需另外开加速器
      </Text>

      <Divider my={5} />

      <BackButton />
    </DocFlex>
  );
}
