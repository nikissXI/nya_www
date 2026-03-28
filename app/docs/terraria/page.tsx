"use client";

import {
  Flex,
  Divider,
  Text,
  Image,
  Heading,
  Link,
  Icon,
} from "@chakra-ui/react";
import { Button } from "@/components/universal/button";
import { MdTipsAndUpdates } from "react-icons/md";
import DocFlex from "@/components/docs/DocFlex";
import DocLink from "@/components/docs/DocLink";
import BackButton from "@/components/docs/BackButton";

export default function Page() {
  return (
    <DocFlex>
      <Heading size="lg" textAlign="center">
        手机、平板、Steam通用
      </Heading>

      <DocLink
        linkText="简略视频演示"
        linkUrl="https://www.bilibili.com/video/BV1a64ge6Ecs/"
      />

      <Text my={1}>
        <Icon as={MdTipsAndUpdates} mr={2} />
        喵服关联QQ群：976129564
      </Text>

      <Text my={1}>
        <Icon as={MdTipsAndUpdates} mr={2} />
        国际版手游可以与Steam版联机（前提版本号相同）；国服（即心动代理版）只能与国服联机，国服直接用内置的联机功能就行
      </Text>

      <Text my={1}>
        <Icon as={MdTipsAndUpdates} mr={2} />
        玩家都处于同个联机房间并在线后，主机创建一个多人世界，客机填主机的喵服IP加入就行，默认端口号7777；如果Windows做主机，其他人加入不了，关闭系统防火墙再试
      </Text>

      <Divider my={5} />

      <Heading size="lg" textAlign="center">
        图文演示
      </Heading>

      <Text mt={3}>下方用安卓国际版演示，其他平台的类似（自己摸索一下）</Text>

      <Image src="/images/terraria/terraria_1.jpg" alt="terraria_1" />

      <Heading size="lg" textAlign="center" mt={3}>
        主机操作步骤
      </Heading>

      <Image src="/images/terraria/terraria_3.jpg" alt="terraria_3" />

      <Heading size="lg" textAlign="center" mt={5}>
        客机操作步骤
      </Heading>

      <Image src="/images/terraria/terraria_2.jpg" alt="terraria_2" />

      <Image src="/images/terraria/terraria_4.jpg" alt="terraria_4" />

      <Divider my={5} />

      <BackButton />
    </DocFlex>
  );
}
