import { Divider, Heading, Text, VStack } from "@chakra-ui/react";
import DocBox from "@/components/docs/DocBox";
import BackButton from "@/components/docs/BackButton";
import { DocMuted, DocStep, DocTip, DocTips } from "@/components/docs/DocParts";

export default function Page() {
  return (
    <DocBox
      notices={[
        "支持安卓与苹果联机，需游戏版本一致",
        "建议选择带宽不低于0.6M的联机节点，4个人也够用",
      ]}
    >
      <Text>喵服逃脱者手游交流Q群 961793250</Text>
      <DocMuted mt={1}>联机有问题或找搭子请加群</DocMuted>

      <Divider my={5} />

      <Heading size="md">联机步骤</Heading>

      <DocMuted my={1}>
        连接WiFi才能联机，否则会提示
        <br />
        “你需要网络连接到局域网会话”
      </DocMuted>

      <VStack align="stretch" spacing={3}>
        <DocStep step={1} role="主机">
          <Text>一名玩家作为主机，选一个地图创建多人游戏，进入地图里等待</Text>
          <DocMuted mt={1}>游戏必须保持在前台，切出游戏外客机就会掉线</DocMuted>
        </DocStep>

        <DocStep step={2} role="客机">
          <Text>
            其他玩家作为客机，在联机房间界面，创建搜索任务位置，填写主机的喵服IP，创建后进游戏，点多人游戏的加入，搜索房间就行
          </Text>
        </DocStep>
      </VStack>

      <Divider my={5} />

      <Heading size="md" mb={3}>
        联机失败？按顺序检查
      </Heading>

      <DocTips>
        <DocTip>
          联机测试的逃脱者手游为东品代理的版本，安卓1.3.2，苹果版本1.70.2，如果游戏更新了请联系服主测试
        </DocTip>
        <DocTip>
          加入游戏后提示“此会话已不可用”，两种情况：要么主机切出游戏外，要么双方游戏版本号不一致
        </DocTip>
      </DocTips>

      <Divider my={5} />

      <BackButton />
    </DocBox>
  );
}
