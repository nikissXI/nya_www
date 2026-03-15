"use client";

import {
  Flex,
  Link,
  Divider,
  Text,
  List,
  ListItem,
  ListIcon,
  Heading,
} from "@chakra-ui/react";
import { Button } from "@/components/universal/button";
import { MdTipsAndUpdates } from "react-icons/md";
import DocFlex from "@/components/docs/DocFlex";
import DocLink from "@/components/docs/DocLink";
import BackButton from "@/components/docs/BackButton";

export default function Page() {
  const TextList = [
    "喵服关联QQ群：908023778",
    "玩家都处于同个联机房间并在线后，主机创建局域网游戏或运行服务端，其他人填主机的联机IP加入就行",
    "服务器名称随意，服务器地址格式“喵服IP:端口号”，如主机的喵服联机IP为“100.64.0.1”，端口号为“12345”，则填写“100.64.0.1:12345”（注意：基岩版的IP地址和端口号是分开两个框填写的）",
    "如果加入时提示“无效会话”，自行去B站搜索“我的世界无效会话怎么解决”，有一堆教程，最简单的方法就是买正版",
    "如果加入失败提示“Connection reset”，并且主机是windows系统，主机关闭系统防火墙再试",
    "其他加入报错请自行搜索解决，或赞助后找服主提供技术支持",
    "建议使用2M及以上带宽的节点，视距开低（如6左右），否则加载地图易卡顿",
  ];

  return (
    <DocFlex>
      <Heading size="lg" textAlign="center">
        Java、基岩版通用
      </Heading>

      <DocLink
        linkText="简略视频演示"
        linkUrl="https://www.bilibili.com/video/BV1UX4GegEAf/"
      />

      <List spacing={2}>
        {TextList.map((reason, index) => (
          <ListItem key={index} textAlign="left">
            <ListIcon as={MdTipsAndUpdates} />
            {reason}
          </ListItem>
        ))}
      </List>

      <Divider my={5} />

      <BackButton />
    </DocFlex>
  );
}
