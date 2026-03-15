"use client";

import {
  Flex,
  Center,
  Divider,
  Text,
  Image,
  Icon,
  Link,
  Heading,
} from "@chakra-ui/react";
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
        linkUrl="https://www.bilibili.com/video/BV1xHS4Y7Ejz/"
      />

      <Text my={1}>
        <Icon as={MdTipsAndUpdates} mr={2} />
        喵服关联QQ群：138012638
      </Text>

      <Text my={1}>
        <Icon as={MdTipsAndUpdates} mr={2} />
        联机教程用Steam正版演示，破解版如果联机异常请自行排查
      </Text>

      <Text my={1}>
        <Icon as={MdTipsAndUpdates} mr={2} />
        求生之路2的官方直连服务器不是一定卡的，就如登陆steam有时候需要加速器有时候不用
      </Text>

      <Text my={1}>
        <Icon as={MdTipsAndUpdates} mr={2} />
        使用喵服联机延迟约为主机和客机各自到节点延迟总和，比如主机到节点延迟30ms，客机到节点延迟50ms，那游戏的实际延迟将至少80ms
      </Text>

      <Divider my={5} />

      <Heading size="lg" textAlign="center">
        主机操作指引
      </Heading>

      <Text mt={3}>
        玩家都处于同个联机房间并在线后，主机进游戏点“与好友一起玩游戏”
      </Text>
      <Image maxW="500px" src="/images/l4d2/l4d2_1.jpg" alt="l4d2_1" />

      <Text mt={3}>选“创建新战役大厅”</Text>
      <Image maxW="500px" src="/images/l4d2/l4d2_2.jpg" alt="l4d2_2" />

      <Text mt={3}>
        服务器类型选“本地服务器”，然后直接开始游戏，注意是开始游戏进到地图里！需要主机已经在地图里客机才能加入
      </Text>
      <Image maxW="500px" src="/images/l4d2/l4d2_3.jpg" alt="l4d2_3" />

      <Heading mt={5} size="lg" textAlign="center">
        客机操作指引
      </Heading>

      <Text mt={3}>
        客机按波浪键“~”调出控制台，使用命令“connect
        主机喵服IP”即可加入，如主机的IP是100.64.0.8，那命令就是“connect
        100.64.0.8”
        <br />
        如果按“~”键没反应，就去游戏设置里，找到“键盘/鼠标”选项，把“允许使用开发者控制台”改为启用
        <br />
        下图就是连接失败的报错，这种情况就检查IP是否填对，防火墙是否放通游戏（不会就直接把防火墙关了试试）
        <br />
        如果是其他报错就是游戏问题，跟喵服无关，自行解决
      </Text>
      <Image maxW="500px" src="/images/l4d2/l4d2_4.jpg" alt="l4d2_4" />

      <Text mt={3}>
        建议到创意工坊把这个mod打上，能一定程度上避免兼容性问题导致无法加入。
      </Text>
      <Image
        src="/images/l4d2/l4d2_关闭一致性检查.jpg"
        alt="l4d2_关闭一致性检查"
      />

      <Divider my={5} />

      <BackButton />
    </DocFlex>
  );
}
