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
        "支持安卓、苹果、电脑三端跨平台联机",
        "2~3人联机时，建议选择带宽不低于0.5M的联机节点，人更多时选择更大带宽节点",
      ]}
    >
      <Text>喵服像素工厂交流Q群 830268831</Text>
      <DocMuted mt={1}>联机有问题或找搭子请加群</DocMuted>

      <DocDivider />

      <Heading size="md">联机步骤</Heading>

      <DocMuted my={1}>端游和手游一样，下图用的是安卓版</DocMuted>

      <VStack align="stretch" spacing={3}>
        <DocStep step={1} role="主机">
          <Text>一名玩家作为主机，进游戏地图后，打开菜单，创建联机游戏就行</Text>
          <DocMuted mt={1}>
            手机或平板做主机时，游戏必须保持在前台，不能锁屏或切到后台
          </DocMuted>
          <DocImage w="400px" src="/images/mindustry/hoster.webp" alt="hoster" />
        </DocStep>

        <DocStep step={2} role="客机">
          <Text>
            其他玩家作为客机，在加入游戏界面，点添加服务器，把主机的喵服联机IP填上去就行
          </Text>
          <DocImage w="400px" src="/images/mindustry/joiner.webp" alt="joiner" />
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
