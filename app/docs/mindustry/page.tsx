
import { Icon, Divider, Text, Image, Heading } from "@chakra-ui/react";
import { Button } from "@/components/universal/button";
import DocFlex from "@/components/docs/DocFlex";
import BackButton from "@/components/docs/BackButton";
import { MdTipsAndUpdates } from "react-icons/md";

export default function Page() {
  return (
    <DocFlex>
      <Text my={1}>
        <Icon as={MdTipsAndUpdates} mr={2} />
        喵服关联QQ群：830268831
      </Text>

      <Text mt={3}>
        <Icon as={MdTipsAndUpdates} mr={2} />
        玩家都处于同个联机房间并在线后，主机进游戏后，打开菜单，创建联机游戏。支持端游和手游联机。
      </Text>

      <Image
        maxW="400px"
        src="/images/mindustry/mindustry_1.webp"
        alt="mindustry_1"
      />

      <Text mt={3}>
        <Icon as={MdTipsAndUpdates} mr={2} />
        客机在加入游戏界面，点添加服务器，把主机的喵服联机IP填上去就行
      </Text>
      <Image
        maxW="400px"
        src="/images/mindustry/mindustry_2.webp"
        alt="mindustry_2"
      />
      <Divider my={5} />

      <BackButton />
    </DocFlex>
  );
}
