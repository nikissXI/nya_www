import { Divider, Heading, Text, VStack } from "@chakra-ui/react";
import DocBox from "@/components/docs/DocBox";
import BackButton from "@/components/docs/BackButton";
import {
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
        "国际版支持安卓、苹果、电脑三端跨平台联机",
        "TapTap版仅支持安卓与苹果联机，且不支持与国际版联机",
        "2-3人联机时，建议选择带宽不低于0.6M的联机节点，人更多时选择更大带宽节点",
      ]}
    >
      <Text>喵服泰拉瑞亚交流Q群 976129564</Text>
      <DocMuted mt={1}>联机有问题或找搭子请加群</DocMuted>

      <Divider my={5} />

      <Heading size="md">联机步骤</Heading>

      <DocMuted my={1}>端游和手游一样，下图用的是安卓国际版</DocMuted>

      <VStack align="stretch" spacing={3}>
        <DocStep step={1} role="主机">
          <Text>
            一名玩家作为主机，进到多人模式，创建一个多人世界并进去世界里等待
          </Text>
          <DocMuted mt={1}>
            手机或平板做主机时，游戏必须保持在前台，不能锁屏或切到后台
          </DocMuted>
          <DocImage w="400px" src="/images/terraria/hoster.webp" alt="hoster" />
        </DocStep>

        <DocStep step={2} role="客机">
          <Text>其他玩家作为客机，进到多人模式，看下图操作吧</Text>
          <DocImage
            mt={1}
            w="400px"
            src="/images/terraria/joiner1.webp"
            alt="joiner1"
          />
          <DocImage
            mt={1}
            w="400px"
            src="/images/terraria/joiner2.webp"
            alt="joiner2"
          />
          <DocImage
            mt={1}
            w="400px"
            src="/images/terraria/joiner3.webp"
            alt="joiner3"
          />
        </DocStep>
      </VStack>

      <Divider my={5} />

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
        <DocTip>
          装tMod不影响联机，如果装了后不能联机，关闭防火墙及检查模组
        </DocTip>
        <DocTip>
          提示版本不一样就自己检查版本，最上面的注意事项写了TapTap版不支持与国际版联机
        </DocTip>
      </DocTips>

      <Divider my={5} />

      <BackButton />
    </DocBox>
  );
}
