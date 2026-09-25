import { Heading, Text, VStack } from "@chakra-ui/react";
import DocBox from "@/components/docs/DocBox";
import BackButton from "@/components/docs/BackButton";
import {
  DocDivider,
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
        "有联机模式的基本都支持，前提版本相同，苹果系统另说",
        "2~3人联机时，建议选择带宽不低于0.5M的联机节点，人更多时选择更大带宽节点",
      ]}
    >
      <Text>喵服机械战争3交流Q群 689358384</Text>
      <DocMuted mt={1}>联机有问题或找搭子请加群</DocMuted>

      <DocDivider />

      <Heading size="md">联机步骤</Heading>

      <DocMuted my={1}>下图用的是安卓版</DocMuted>

      <VStack align="stretch" spacing={3}>
        <DocStep step={1} role="主机">
          <Text>一名玩家作为主机，点击“创建服务器”，然后等待其他玩家加入</Text>
          <DocMuted mt={1}>
            手机或平板做主机时，游戏必须保持在前台，不能锁屏或切到后台
          </DocMuted>
        </DocStep>

        <DocStep step={2} role="客机">
          <Text>
            其他玩家作为客机，点击“加入服务器”，不出意外就能搜索到游戏，选中后点击加入
          </Text>
          <DocMuted mt={1}>
            好像在聊天框输入主机的喵服IP也能加入游戏，待考证
          </DocMuted>
        </DocStep>
      </VStack>

      <DocDivider />

      <Heading size="md" mb={3}>
        联机失败？按顺序检查
      </Heading>

      <DocTips>
        <DocTip>
          如果是Windows做主机，试试关闭防火墙
          <ExtLink href="https://zhuanlan.zhihu.com/p/397675766">
            不会关点我
          </ExtLink>
        </DocTip>
        <DocTip>如果加入后或规律性闪退、黑屏，请自行检查mod或是游戏bug</DocTip>
      </DocTips>

      <DocDivider />

      <BackButton />
    </DocBox>
  );
}
