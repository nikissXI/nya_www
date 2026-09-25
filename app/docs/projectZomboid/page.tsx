import { Heading, Text, VStack } from "@chakra-ui/react";
import DocBox from "@/components/docs/DocBox";
import BackButton from "@/components/docs/BackButton";
import {
  DocDivider,
  DocImage,
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
        "2~3人联机时，建议选择带宽不低于0.5M的联机节点，人更多时选择更大带宽节点",
      ]}
    >
      <Text>该游戏玩家群体太小，没有专门的交流群</Text>
      <DocMuted mt={1}>联机有问题请去大群找群主</DocMuted>

      <DocDivider />

      <Heading size="md" mb={2}>
        联机步骤
      </Heading>

      <VStack align="stretch" spacing={3}>
        <DocStep step={1} role="主机">
          <Text>一名玩家作为主机，建立服务器，进到地图里等待</Text>
        </DocStep>

        <DocStep step={2} role="客机">
          <Text>其他玩家作为客机，根据下图指引填写信息加入游戏</Text>
          <DocImage src="/images/projectZomboid/hoster.webp" alt="hoster" />
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
