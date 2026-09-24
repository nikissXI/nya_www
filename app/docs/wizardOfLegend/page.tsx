import { Divider, Heading, Text, VStack } from "@chakra-ui/react";
import DocBox from "@/components/docs/DocBox";
import BackButton from "@/components/docs/BackButton";
import { DocMuted, DocStep } from "@/components/docs/DocParts";

export default function Page() {
  return (
    <DocBox
      notices={[
        "支持安卓与苹果联机，但仅安卓能搜索房间",
        "不支持电脑端，因为电脑端没有联机模式",
        "建议选择带宽不低于0.3M的联机节点",
      ]}
    >
      <Text>喵服传说法师交流Q群 981286541</Text>
      <DocMuted mt={1}>联机有问题或找搭子请加群</DocMuted>

      <Divider my={5} />

      <Heading size="md">联机步骤</Heading>

      <DocMuted my={1}>端游和手游一样，下图用的是安卓版</DocMuted>

      <VStack align="stretch" spacing={3}>
        <DocStep step={1} role="主机">
          <Text>一名玩家作为主机，进游戏创建联机房间，等待另一名玩家加入</Text>
          <DocMuted mt={1}>游戏必须保持在前台，不能锁屏或切到后台</DocMuted>
        </DocStep>

        <DocStep step={2} role="客机">
          <Text>另一名玩家作为客机，进游戏点加入房间搜索即可</Text>
          <DocMuted mt={1}>苹果系统无法搜索房间，只能做主机</DocMuted>
        </DocStep>
      </VStack>

      <Divider my={5} />

      <BackButton />
    </DocBox>
  );
}
