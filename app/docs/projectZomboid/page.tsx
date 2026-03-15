"use client";
import { Text, Divider, Icon, Image } from "@chakra-ui/react";
import { Button } from "@/components/universal/button";
import { MdTipsAndUpdates } from "react-icons/md";
import DocFlex from "@/components/docs/DocFlex";
import BackButton from "@/components/docs/BackButton";

export default function AndroidPage0() {
  return (
    <DocFlex>
      <Text my={1}>
        <Icon as={MdTipsAndUpdates} mr={2} />
        喵服关联QQ群：玩家太少，暂时不建群，如果需要建群加服主QQ1299577815
      </Text>

      <Text my={1}>
        <Icon as={MdTipsAndUpdates} mr={2} />
        玩家都处于一个联机房间后，主机建立服务器，客机加入服务器，填写的内容看图。如果加入失败，主机关闭防火墙再试
      </Text>

      <Image
        src="/images/projectZomboid/projectZomboid.jpg"
        alt="projectZomboid"
      />

      <Divider my={5} />

      <BackButton />
    </DocFlex>
  );
}
