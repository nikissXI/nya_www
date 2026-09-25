import { Divider, Heading, Text, VStack } from "@chakra-ui/react";
import DocBox from "@/components/docs/DocBox";
import BackButton from "@/components/docs/BackButton";
import { DocMuted, DocStep, DocTip, DocTips, ExtLink } from "@/components/docs/DocParts";

export default function Page() {
  return (
    <DocBox notices={["建议选择带宽不低于0.6M的联机节点，4个人也够用"]}>
      <Text>
        视频教程由B站UP主Winters_Stone1制作
        <ExtLink href="https://www.bilibili.com/video/BV1dZSeBLE4e/">
          查看视频
        </ExtLink>
      </Text>

      <Divider my={3} />

      <Text>喵服以撒的结合交流Q群 1074963191</Text>
      <DocMuted mt={1}>联机有问题或找搭子请加群</DocMuted>

      <Divider my={3} />

      <Heading size="md">联机步骤</Heading>

      <DocMuted my={1}>
        简单的说，玩家都连上喵服，直接联机就行，不要开其他加速器
      </DocMuted>

      <VStack align="stretch" spacing={3}>
        <DocStep step={1} role="主机">
          <Text>一名玩家作为主机，创建多人游戏</Text>
        </DocStep>

        <DocStep step={2} role="客机">
          <Text>其他玩家作为客机，通过Steam好友邀请或房间密码都可以</Text>
        </DocStep>
      </VStack>

      <Divider my={3} />

      <Heading size="md" mb={3}>
        联机还是很卡？
      </Heading>

      <DocTips>
        <DocTip>
          这游戏需要所有玩家延迟都低才行，其中一个人卡其他人也会跟着卡，可以尝试调整输入延迟，或把卡比踢了吧（手动狗头）
        </DocTip>
        <DocTip>
          进以撒群找服主检查联机流量是否走了喵服，有时候流量不走喵服
        </DocTip>
      </DocTips>

      <Divider my={3} />

      <BackButton />
    </DocBox>
  );
}
