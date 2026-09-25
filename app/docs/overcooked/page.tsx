import { Divider, Heading, Text, VStack } from "@chakra-ui/react";
import DocBox from "@/components/docs/DocBox";
import BackButton from "@/components/docs/BackButton";
import { DocMuted, DocStep, DocTip, DocTips } from "@/components/docs/DocParts";

export default function Page() {
  return (
    <DocBox notices={["建议选择带宽不低于0.6M的联机节点，4个人也够用"]}>
      <Text>该游戏玩家群体太小，没有专门的交流群</Text>
      <DocMuted mt={1}>联机有问题请去大群找群主</DocMuted>

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
          <Text>其他玩家作为客机，通过Steam好友邀请即可</Text>
        </DocStep>
      </VStack>

      <Divider my={3} />

      <Heading size="md" mb={3}>
        联机还是很卡？
      </Heading>

      <DocTips>
        <DocTip>
          进大群找服主检查联机流量是否走了喵服，有时候流量不走喵服
        </DocTip>
      </DocTips>

      <Divider my={3} />

      <BackButton />
    </DocBox>
  );
}
