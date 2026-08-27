import { Icon, Divider, Text, Image, Link } from "@chakra-ui/react";
import DocFlex from "@/components/docs/DocFlex";
import BackButton from "@/components/docs/BackButton";
import { MdTipsAndUpdates } from "react-icons/md";

export default function Page() {
  return (
    <DocFlex>
      <Text textAlign="center" my={1}>
        这里只有手游的联机教程，如果是端游请找服主
      </Text>

      <Text my={1}>
        <Icon as={MdTipsAndUpdates} mr={2} />
        喵服关联QQ群：1106534252
      </Text>

      <Text my={1}>
        <Icon as={MdTipsAndUpdates} mr={2} />
        手游需要使用
        <Link
          href="https://space.bilibili.com/597869160"
          color="#7dd4ff"
          target="_blank"
        >
          琳星Lin-C
        </Link>
        制作的版本，否则无法使用喵服联机，群文件也有安装包
      </Text>

      <Text mt={1}>
        <Icon as={MdTipsAndUpdates} mr={2} />
        玩家都处于同个联机房间并在线后，主机按下图创建游戏，创建完成后要保持在游戏里，否则客机无法加入
      </Text>

      <Image mb={1} maxW="800px" src="/images/ark/ark_1.webp" alt="ark_1" />

      <Text my={1}>
        <Icon as={MdTipsAndUpdates} mr={2} />
        客机打开控制台，使用命令加入游戏“admincheat open
        主机的喵服IP”，比如主机的喵服IP是100.64.0.1，那就写“admincheat open
        100.64.0.1”
      </Text>

      <Text my={1}>
        <Icon as={MdTipsAndUpdates} mr={2} />
        如果客机加入出现连接超时，客机自己开个主机房间，然后再退出来，进单机再输入一次代码就能进了
      </Text>

      <Text my={1}>
        <Icon as={MdTipsAndUpdates} mr={2} />
        联机时，玩家相距过远会拉回，要修改的话进上面提到的关联群，群文件有修改教程
      </Text>

      <Divider my={5} />

      <BackButton />
    </DocFlex>
  );
}
