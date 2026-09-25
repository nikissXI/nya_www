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
        "支持端游和手游联机，需游戏版本一致",
        "建议选择STS联机节点，8个人联机也够用",
      ]}
    >
      <Text>喵服杀戮尖塔交流Q群 698892019</Text>
      <DocMuted mt={1}>联机有问题或找搭子请加群</DocMuted>

      <DocDivider />

      <Heading size="md">联机步骤</Heading>

      <DocMuted my={1}>端游和手游一样，不过端游要加mod，下面细说</DocMuted>

      <VStack align="stretch" spacing={3}>
        <DocStep step={1} role="主机">
          <Text>一名玩家作为主机，进入多人模式，创建多人游戏</Text>
          <DocMuted mt={1}>
            手机或平板做主机时，游戏必须保持在前台，不能锁屏或切到后台
          </DocMuted>
        </DocStep>

        <DocStep step={2} role="客机">
          <Text>
            其他玩家作为客机，填写主机的喵服IP加入即可，端口用默认的33771
          </Text>
          <DocMuted mt={1}>
            如果有任一玩家是端游，就需要全部玩家都安装IP联机mod，因为端游原版是没有IP联机选项的
          </DocMuted>
        </DocStep>

        <DocStep step="" role="IP联机mod（按需安装）">
          <DocMuted>
            如果全部玩家都是手游就不需要装IP联机mod，手游已经内置了
          </DocMuted>

          <Text my={1}>
            这里提供一个兼容v0.111版本的，也可以自行找其他同类mod
            <ExtLink href="/apks/[IP直连1.4.0][v0.111].zip">
              下载IP联机mod
            </ExtLink>
          </Text>

          <DocMuted>
            手游如果安装了IP联机mod，需要在启动器的设置里把“本地联机补丁”关掉
          </DocMuted>
          <DocImage
            w="300px"
            src="/images/slayTheSpire/off_lan_mod.webp"
            alt="off_lan_mod"
          />
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
        <DocTip>
          如果手游加入报错，并且装了IP联机mod，请检查“本地联机补丁”是否关掉，上面有提及
        </DocTip>
        <DocTip>如果加入后或规律性闪退、黑屏，请自行检查mod或是游戏bug</DocTip>
      </DocTips>

      <DocDivider />

      <BackButton />
    </DocBox>
  );
}
