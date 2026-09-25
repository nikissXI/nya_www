import { Heading, Text, VStack } from "@chakra-ui/react";
import DocBox from "@/components/docs/DocBox";
import BackButton from "@/components/docs/BackButton";
import { DocDivider, DocMuted, DocStep, DocTip, DocTips, ExtLink } from "@/components/docs/DocParts";
import { GENERAL_QQ_GROUP } from "@/utils/roomGames";

export default function Page() {
  return (
    <DocBox
      notices={["手机或平板做主机时，要保持在游戏中，否则客机无法加入或掉线"]}
    >
      <Heading size="lg" textAlign="center">
        通用组网联机教程
      </Heading>

      <DocMuted my={3}>
        适用范围：支持通过 IP
        加入的游戏；仅支持搜索或邀请加入的游戏，需要自行确认是否兼容
        <br />
        有其他联机问题请加Q群{GENERAL_QQ_GROUP}
      </DocMuted>

      <Heading size="md" mb={2}>
        联机步骤（就两步）
      </Heading>

      <VStack align="stretch" spacing={3}>
        <DocStep step={1} role="主机创建游戏">
          <Text>
            一名玩家作为主机，主机负责进入游戏的联机模式，按游戏提示创建世界或房间
          </Text>
          <DocMuted mt={1}>
            保持游戏运行，主机把自己的喵服IP和游戏端口告诉客机
          </DocMuted>
        </DocStep>

        <DocStep step={2} role="客机加入（方式一：IP 直连）">
          <Text>
            其他玩家作为客机加入，进入游戏的多人或直接连接页面，填写主机的喵服IP和端口
          </Text>
          <DocMuted mt={1}>
            游戏端口由具体游戏的联机设置决定，如果IP和端口分开填写，就分别填入对应输入框。使用命令加入的游戏，请查找该游戏对应的连接命令
          </DocMuted>
        </DocStep>

        <DocStep step={2} role="客机加入（方式二：搜索或邀请）">
          <Text>
            如果游戏只能搜索房间或接受主机邀请，无法直接填写
            IP，则需要自行确认该游戏是否支持喵服组网
          </Text>
        </DocStep>
      </VStack>

      <DocDivider />

      <Heading size="md" mt={5} mb={3}>
        联机失败常见原因
      </Heading>

      <DocTips>
        <DocTip>
          如果是Windows做主机，试试关闭防火墙
          <ExtLink href="https://zhuanlan.zhihu.com/p/397675766">
            不会关点我
          </ExtLink>
        </DocTip>
        <DocTip>
          检查主机是否仍在游戏中、IP
          和端口是否正确，以及游戏版本、模组等是否一致
        </DocTip>
      </DocTips>

      <DocDivider />

      <BackButton />
    </DocBox>
  );
}
