import { Heading, Text, VStack, Flex } from "@chakra-ui/react";
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

      <DocMuted mt={1}>如果装了联机大厅mod要禁用！</DocMuted>
      <DocMuted mb={1}>端游需要安装局域网联机mod！（下面有提供）</DocMuted>

      <VStack align="stretch" spacing={3}>
        <DocStep step={1} role="主机">
          <Text>
            一名玩家作为主机，进入多人模式，点创建（端游使用局域网开房）
          </Text>
          <DocMuted mt={1}>
            手机或平板做主机时，游戏必须保持在前台，不能锁屏或切到后台
          </DocMuted>
        </DocStep>

        <DocStep step={2} role="客机">
          <Text>
            其他玩家作为客机，进入多人模式，点加入（端游使用局域网加入），填写主机的喵服IP加入即可，端口用33771
          </Text>
        </DocStep>
      </VStack>

      <DocDivider />

      <Heading size="md" mb={3}>
        局域网联机mod（只需要端游安装）
      </Heading>

      {/* <Text my={1} fontSize="sm">
        这里提供几个不同版本的IP联机mod，如果都不好使可以进群问问，或自己去创意工坊找其他同类mod
      </Text>
      <Flex gap={3} fontSize="sm">
        <ExtLink href="/download/sts联机mod_v0.113.zip">适配v0.113</ExtLink>
        <ExtLink href="/download/sts联机mod_v0.108.zip">适配v0.108</ExtLink>
        <ExtLink href="/download/sts联机mod_v0.105.zip">适配v0.105</ExtLink>
      </Flex> */}
      {/* <Text my={1} fontSize="sm">
        手游如果安装了IP联机mod，需要在启动器的设置里把“本地联机补丁”关掉
      </Text>
      <DocImage
        w="300px"
        src="/images/sts/off_lan_mod.webp"
        alt="off_lan_mod"
      /> */}

      <Text my={1} fontSize="sm">
        这里目前只提供最新beta版本v0.113.1的局域网联机mod，如果需要其他请加Q群
        698892019
      </Text>
      <ExtLink href="/download/sts2局域网联机mod-适配v0.113.1-版本v0.1.0.zip">
        点击下载局域网联机mod
      </ExtLink>

      <Text my={1} fontSize="sm">
        下载后解压，把文件夹放到游戏的mods目录里，就跟加其他mod一样
      </Text>

      <DocDivider />

      <Heading size="md" mb={3}>
        联机失败？按顺序检查
      </Heading>

      <DocTips>
        <DocTip>使用喵服进行联机时，如果装了联机大厅mod要禁用</DocTip>
        <DocTip>如果是Windows做主机，试试关闭系统防火墙</DocTip>
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
