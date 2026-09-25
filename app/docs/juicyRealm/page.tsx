import { Divider, Heading, Text, VStack } from "@chakra-ui/react";
import DocBox from "@/components/docs/DocBox";
import BackButton from "@/components/docs/BackButton";
import {
  DocMuted,
  DocStep,
  DocTip,
  DocTips,
  ExtLink,
} from "@/components/docs/DocParts";

export default function Page() {
  return (
    <DocBox
      notices={[
        "支持安卓、苹果、电脑三端跨平台联机",
        "建议选择带宽不低于0.3M的联机节点",
      ]}
    >
      <Text>喵服恶果之地交流Q群 981282876</Text>
      <DocMuted mt={1}>联机有问题或找搭子请加群</DocMuted>

      <Divider my={3} />

      <Heading size="md">联机步骤</Heading>

      <DocMuted my={1}>端游和手游一样操作</DocMuted>

      <VStack align="stretch" spacing={3}>
        <DocStep step={1} role="主机">
          <Text>
            一名玩家作为主机，进游戏点双人，点创建房间，等待另一名玩家加入
          </Text>
          <DocMuted mt={1}>
            手机或平板做主机时，游戏必须保持在前台，不能锁屏或切到后台
          </DocMuted>
        </DocStep>

        <DocStep step={2} role="客机">
          <Text>
            另一名玩家作为客机，进游戏点双人，点加入房间，如果搜不到房间，填写主机的喵服IP加入游戏
          </Text>
          <DocMuted mt={1}>
            注意填的IP是喵服联机房间上显示的，不是用主机游戏里显示的IP
          </DocMuted>
        </DocStep>
      </VStack>

      <Divider my={3} />

      <Heading size="md" mb={3}>
        联机失败？
      </Heading>

      <DocTips>
        <DocTip>
          如果是Windows做主机，试试关闭防火墙
          <ExtLink href="https://zhuanlan.zhihu.com/p/397675766">
            不会关点我
          </ExtLink>
        </DocTip>
      </DocTips>

      <Divider my={3} />

      <BackButton />
    </DocBox>
  );
}
