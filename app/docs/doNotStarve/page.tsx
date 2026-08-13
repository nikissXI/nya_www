"use client";

import { Heading, Divider, Text, Image, Icon } from "@chakra-ui/react";
import { Button } from "@/components/universal/button";
import { MdTipsAndUpdates } from "react-icons/md";
import DocFlex from "@/components/docs/DocFlex";
import BackButton from "@/components/docs/BackButton";

export default function Page() {
  return (
    <DocFlex>
      <Text my={1}>
        <Icon as={MdTipsAndUpdates} mr={2} />
        喵服关联QQ群：641115719
      </Text>

      <Text my={1}>
        <Icon as={MdTipsAndUpdates} mr={2} />
        端游目前不能与手游联机
      </Text>

      <Divider my={5} />

      <Heading size="lg" mb={3}>
        端游联机
      </Heading>

      <Text my={1}>
        <Icon as={MdTipsAndUpdates} mr={2} />
        玩家都处于同个联机房间并在线后，主机创建多人游戏，客机进浏览游戏，右上角的连接选LAN，然后刷新房间列表即可
      </Text>

      <Text my={1}>
        <Icon as={MdTipsAndUpdates} mr={2} />
        电脑端联机时，如果房间列表搜索不到，按“~”调出控制台，输入命令“c_connect(&quot;主机IP&quot;,10999,&quot;密码&quot;)”，如“c_connect(&quot;100.64.0.1&quot;,10999,&quot;123456&quot;)”
      </Text>

      <Text my={1}>
        <Icon as={MdTipsAndUpdates} mr={2} />
        如果仍然搜不到，主机关闭系统防火墙后再试
      </Text>

      <Image
        src="/images/doNotStarve/doNotStarve_1.webp"
        maxW="400px"
        alt="doNotStarve_1"
      />

      <Divider my={5} />

      <Heading size="lg" mb={3}>
        手游联机
      </Heading>

      <Text my={1}>
        <Icon as={MdTipsAndUpdates} mr={2} />
        玩家都处于同个联机房间并在线后，主机创建多人游戏，客机搜索房间加入即可
      </Text>

      <Text my={1}>
        <Icon as={MdTipsAndUpdates} mr={2} />
        手游苹果和安卓可以联机，但需要两边都用离线模式（都是在线模式不确定是否可以），而且苹果不能做客机（就是无法加入游戏）
      </Text>

      <Text my={1}>
        <Icon as={MdTipsAndUpdates} mr={2} />
        如果客机加入时提示“这个服务器仅允许在相同局域网的玩家连接”，重开游戏再尝试加入，这是游戏Bug
      </Text>
      <Image
        src="/images/doNotStarve/doNotStarve_2.webp"
        maxW="400px"
        alt="doNotStarve_2"
      />

      <Divider my={5} />

      <BackButton />
    </DocFlex>
  );
}
