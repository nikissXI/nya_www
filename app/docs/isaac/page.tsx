"use client";

import { Divider, Text } from "@chakra-ui/react";
import { Button } from "@/components/universal/button";
import DocFlex from "@/components/docs/DocFlex";
import DocLink from "@/components/docs/DocLink";
import BackButton from "@/components/docs/BackButton";

export default function Page() {
  return (
    <DocFlex>
      <Text mt={3} textAlign="center">
        教程由B站UP主Winters_Stone1制作，请到B站观看视频教程
      </Text>

      <DocLink
        linkText=""
        linkUrl="https://www.bilibili.com/video/BV1dZSeBLE4e/"
      />

      <Text textAlign="center">喵服关联QQ群：1074963191</Text>

      <Text textAlign="center">
        该游戏联机功能做的很屎，需要低网络延迟否则很卡，而且其中一个人卡其他人跟着卡。更多问题请加Q群问。服主不解决游戏里的联机和mod问题，因为不玩这游戏。
      </Text>

      <Divider my={5} />

      <BackButton />
    </DocFlex>
  );
}
