import { Divider, Heading, Text, VStack } from "@chakra-ui/react";
import DocBox from "@/components/docs/DocBox";
import BackButton from "@/components/docs/BackButton";
import {
  DocCode,
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
        "2-3人联机时，建议选择带宽不低于0.5M的联机节点，人更多时选择更大带宽节点",
      ]}
    >
      <Text>这里只有手游的联机教程，如果是端游请找服主</Text>

      <Divider my={5} />

      <Text textAlign="center"></Text>

      <Text>喵服方舟手游交流Q群 1106534252</Text>
      <DocMuted mt={1}>联机有问题或找搭子请加群</DocMuted>

      <Divider my={5} />

      <Heading size="md">联机步骤</Heading>

      <DocMuted my={1}>
        手游需要使用
        <ExtLink href="https://space.bilibili.com/597869160">
          琳星Lin-C
        </ExtLink>
        制作的版本，群文件里可下载
      </DocMuted>

      <VStack align="stretch" spacing={3}>
        <DocStep step={1} role="主机">
          <Text>一名玩家作为主机，根据下图创建多人游戏</Text>
          <DocMuted my={1}>游戏必须保持在前台，不能锁屏或切到后台</DocMuted>
          <DocImage w="600px" src="/images/ark/ark_1.webp" alt="ark_1" />
        </DocStep>

        <DocStep step={2} role="客机">
          <Text>
            其他玩家作为客机，打开游戏控制台，输入命令加入游戏，格式如下
            <DocCode>admincheat open 主机喵服IP</DocCode>
            比如主机喵服IP是100.64.0.1
            <DocCode>admincheat open 100.64.0.1</DocCode>
          </Text>
        </DocStep>
      </VStack>

      <Divider my={5} />

      <Heading size="md" mb={3}>
        联机失败？按顺序检查
      </Heading>

      <DocTips>
        <DocTip>
          如果加入提示连接超时，客机自己开个主机房间，再退出来，然后进单机再输入一次代码就能进了
        </DocTip>
        <DocTip>
          如果加入游戏后闪退，检查双方游戏版本是否一致，如果是一致，主机重开游戏试试，还不行就进群问问
        </DocTip>
      </DocTips>

      <Divider my={5} />

      <Heading size="md" mb={3}>
        修改联机游戏距离
      </Heading>

      <VStack align="stretch" spacing={1}>
        <DocTip>
          找到游戏的配置文件
          GameUserSettings.ini，找到下方的这个设置并将数值改为40.00000
          <DocCode>ListenServerTetherDistanceMultiplier=40.00000</DocCode>
        </DocTip>
        <DocMuted>只需要主机修改，40为建议值，太大也不行</DocMuted>
      </VStack>

      <Divider my={5} />

      <BackButton />
    </DocBox>
  );
}
