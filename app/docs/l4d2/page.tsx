import { Heading, Text, VStack } from "@chakra-ui/react";
import DocBox from "@/components/docs/DocBox";
import BackButton from "@/components/docs/BackButton";
import {
  DocCode,
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
        "正版和盗版都支持，但盗版卡Steam验证自己去解决",
        "2~3人联机时，建议选择带宽不低于0.8M的联机节点，人更多时选择更大带宽节点",
      ]}
    >
      <Text>喵服求生之路2交流Q群 138012638</Text>
      <DocMuted mt={1}>联机有问题或找搭子请加群</DocMuted>

      <DocDivider />

      <Heading size="md">启用游戏控制台</Heading>

      <Text my={1}>
        进入游戏主界面，点击 <strong>选项 → 键盘/鼠标</strong>
        ，将“允许使用开发者控制台”设置为启用
      </Text>

      <Text>
        在游戏中按 <strong>~</strong> 键（通常在键盘左上角）打开控制台
      </Text>

      <DocDivider />

      <Heading size="md">联机步骤</Heading>

      <DocMuted my={1}>教程使用的是Steam正版</DocMuted>

      <VStack align="stretch" spacing={3}>
        <DocStep step={1} role="主机">
          <Text>
            一名玩家作为主机，进游戏点
            <strong>完成战役 → 与好友一起玩游戏 → 创建新战役大厅</strong>
          </Text>
          <DocImage w="500px" src="/images/l4d2/hoster1.webp" alt="hoster1" />

          <Text mt={3}>
            服务器类型选 <strong>本地服务器</strong>
            ，然后直接开始游戏，进到游戏地图里等待
          </Text>
          <DocImage w="500px" src="/images/l4d2/hoster3.webp" alt="hoster3" />

          <Text mt={3}>
            如果玩第三方地图，打开控制台用命令创建游戏
            <DocCode>map 地图代码 游戏模式</DocCode>
            比如 死亡中心-旅馆 合作模式
            <DocCode>map c1m1_hotel coop</DocCode>
          </Text>
          <DocMuted mt={1}>控制台更多命令用法自行网上搜索或问AI</DocMuted>
        </DocStep>

        <DocStep step={2} role="客机">
          <Text>
            其他玩家作为客机，打开控制台用命令加入游戏
            <DocCode>connect 主机喵服IP</DocCode>
            比如主机喵服IP是100.64.0.1
            <DocCode>connect 100.64.0.1</DocCode>
          </Text>
        </DocStep>
      </VStack>

      <DocDivider />

      <Heading size="md" mb={3}>
        联机失败？按顺序检查
      </Heading>

      <DocTips>
        <DocTip>
          加入游戏失败如果是下图错误，让主机关闭防火墙再试
          <ExtLink href="https://zhuanlan.zhihu.com/p/397675766">
            不会关点我
          </ExtLink>
          <DocImage h="150px" src="/images/l4d2/joiner.webp" alt="joiner" />
        </DocTip>
        <DocTip>
          其他加入报错请加群询问（不一定能解决）或自行网上查找解决方法
        </DocTip>
        <DocTip>
          建议到创意工坊把这个mod打上，能一定程度上避免兼容性问题导致无法加入，或自己找其他类似的mod也可以
          <DocImage w="500px" src="/images/l4d2/mod.webp" alt="mod" />
        </DocTip>
      </DocTips>

      <DocDivider />

      <Heading size="md" mb={3}>
        用喵服后联机还是卡顿？
      </Heading>

      <DocTips>
        <DocTip>
          比如主机到节点延迟30ms，客机到节点延迟50ms，那游戏的实际延迟将至少80ms
        </DocTip>
        <DocTip>
          如果丧尸一多，主机客机就一起卡，这种情况多半是主机电脑硬件太新，这老游戏对新硬件兼容性不好，可以尝试用服务端开服
        </DocTip>
      </DocTips>

      <DocDivider />

      <BackButton />
    </DocBox>
  );
}
