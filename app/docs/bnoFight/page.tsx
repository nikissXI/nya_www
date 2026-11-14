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
} from "@/components/docs/DocParts";

export default function Page() {
  return (
    <DocBox
      notices={[
        "支持端游和手游联机，需游戏版本一致",
        "建议选择带宽不低于0.4M的联机节点",
      ]}
    >
      <Text>跨界对决交流Q群 1073963542</Text>
      <DocMuted mt={1}>联机有问题或找搭子请加群</DocMuted>

      <DocDivider />

      <Heading size="md" mb={2}>
        联机步骤
      </Heading>

      <VStack align="stretch" spacing={3}>
        <DocStep step={1} role="主机">
          <Text>一名玩家作为主机，选对战模式，局域网对战，然后进去等待</Text>
          <DocMuted mt={1}>
            手机或平板做主机时，游戏必须保持在前台，不能锁屏或切到后台
          </DocMuted>
          <DocImage
            w="600px"
            src="/images/bnoFight/bnoFight_1.webp"
            alt="bnoFight_1"
          />
        </DocStep>

        <DocStep step={2} role="客机">
          <Text>
            另一位玩家作为客机，选对战模式，局域网对战，直接搜索房间即可
          </Text>
          <DocImage
            w="600px"
            src="/images/bnoFight/bnoFight_2.webp"
            alt="bnoFight_2"
          />
        </DocStep>
      </VStack>

      <DocDivider />

      <Heading size="md" mb={3}>
        联机失败？按顺序检查
      </Heading>

      <DocTips>
        <DocTip>如果是Windows做主机，试试关闭系统防火墙</DocTip>
        <DocTip>
          如果2P在房间列表可以看到1P创建的房间，但是进不去并且显示人数是（0/2）则说明2P房间还没缓存过来，遇到这种情况需退出局域网对战模式后重新返回即可
        </DocTip>
        <DocTip>
          如果2P在房间列表看到房间列表是满的，但是全部显示的是“文本”两字的乱码是报错了，需要1P重新创建房间并且2P划掉后台大退重启
        </DocTip>
      </DocTips>

      <DocDivider />

      <BackButton />
    </DocBox>
  );
}
