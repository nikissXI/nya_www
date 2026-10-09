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
    <DocBox notices={["建议选择带宽不低于0.6M的联机节点，4个人也够用"]}>
      <Text>
        视频教程由B站UP主Winters_Stone1制作
        <ExtLink href="https://www.bilibili.com/video/BV1dZSeBLE4e/">
          查看视频
        </ExtLink>
      </Text>

      <DocDivider />

      <Text>喵服以撒的结合交流Q群 1074963191</Text>
      <DocMuted mt={1}>联机有问题或找搭子请加群</DocMuted>

      <DocDivider />

      <Heading size="md">原版联机步骤</Heading>

      <DocMuted my={1}>
        简单的说，玩家都连上喵服，直接联机就行，不要开其他加速器
      </DocMuted>

      <VStack align="stretch" spacing={3}>
        <DocStep step={1} role="主机">
          <Text>一名玩家作为主机，创建多人游戏</Text>
        </DocStep>

        <DocStep step={2} role="客机">
          <Text>其他玩家作为客机，通过Steam好友邀请或房间密码都可以</Text>
        </DocStep>
      </VStack>

      <DocMuted mt={1}>
        内置的联机功能很烂，如果用了喵服还是卡，就看下面的局域网联机mod
      </DocMuted>

      <DocDivider />

      <Heading size="md">
        联机还是很卡？试试安装局域网联机mod
      </Heading>
      <DocMuted mt={1}>这个mod刚开发出来没多久，bug较多。可以到以撒群里反馈bug，开发者也在群里。但用这个mod联机能稳定很多</DocMuted>
      <VStack align="stretch" spacing={3}>
        <DocStep step={1} role="安装“以撒：忏悔+”">
          <DocImage
            w="600px"
            src="/images/isaac/mod_install_1.webp"
            alt="hoster1"
          />
          <DocImage
            w="600px"
            src="/images/isaac/mod_install_2.webp"
            alt="hoster1"
          />
          <DocImage
            w="600px"
            src="/images/isaac/mod_install_3.webp"
            alt="hoster1"
          />
        </DocStep>

        <DocStep step={2} role="下载、安装局域网联机mod">
          <Text>
            由社区大佬制作，mod的下载地址
            <ExtLink href="https://github.com/BMingSY/isaac-lan/releases/tag/v0.2.0">
              点击跳转github下载
            </ExtLink>
            <br />
            如果打不开github也可以在这里下载，但不一定是最新版，当前版本v0.2.0
            <ExtLink href="/download/Isaac-LAN-v0.2.0-windows-x86.zip">
              点击下载联机mod
            </ExtLink>
          </Text>

          <Text>
            1. 下载后解压，运行 Install.cmd
            <br />
            2. 保持游戏是关闭状态，选择游戏目录中的 isaac-ng.exe
            <br />
            3. 从 Steam 正常启动游戏，选择存档栏，进入 ONLINE／在线联机 →
            局域网联机
          </Text>
        </DocStep>

        <DocStep step={3} role="主机">
          <Text>一名玩家作为主机，局域网联机里选创建房间，等就行了</Text>
          <DocMuted mt={1}>
            如果客机加入失败，关闭防火墙再试试
            <ExtLink href="https://zhuanlan.zhihu.com/p/397675766">
              不会关点我
            </ExtLink>
          </DocMuted>
          <DocImage
            w="600px"
            src="/images/isaac/mod_install_4.webp"
            alt="hoster1"
          />
        </DocStep>

        <DocStep step={4} role="客机">
          <Text>
            其他玩家作为客机，局域网联机里选输入房主IP，然后填主机的喵服IP，加入房间
          </Text>
          <DocImage
            w="600px"
            src="/images/isaac/mod_install_5.webp"
            alt="hoster1"
          />
        </DocStep>
      </VStack>

      <DocDivider />

      <BackButton />
    </DocBox>
  );
}
