"use client";

import { Flex, Center, Divider, Text, Image } from "@chakra-ui/react";
import { Button } from "@/components/universal/button";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    <Center>
      <Flex
        direction="column"
        justifyContent="space-between"
        alignItems="center"
        mb={5}
        mx="5vw"
      >
        <Text my={3}>
          玩家都处于同个联机房间后，主机主持农场，客机填主机的喵服IP加入即可。
          <br />
          只要游戏版本号一致，就可以一起联机，不论安卓、苹果、PC。
          <br />
          如果是带mod联机，需要主机和客机装的mod一样。
          <br />
          电脑Windows主持农场如果其他人加入不了，检查系统防火墙是否放通了星露谷。
          <br />
          如果联机失败，先确认喵服是在线状态（WG连上），加入的时候游戏没有放后台，尝试重进游戏或换个人主持农场。加喵服的星露谷群817658554，群里发“查房”可以检测房间能否被搜索，每个人都试试主持能不能被搜索到。
        </Text>

        <Button
          bgColor="#c1447d"
          onClick={() => {
            window.open(
              "https://www.bilibili.com/video/BV1U1eGe8Eka/",
              "_blank"
            );
          }}
        >
          点击查看视频演示
        </Button>

        <Divider my={3} />

        <Text>
          iPhone玩家如果联机失败，检查星露谷是否有无线数据的权限（在设置里看，如下图），如果没有就无法联机（iPad没有这个，但也有这种问题）。一般第一次打开游戏会有个网络权限申请弹框，如果没有的话自己捣鼓一下怎么开吧，属于游戏问题，没正确申请联网权限。
        </Text>

        <Image
          src="/images/stardewValley/星露谷ios网络权限.png"
          alt="星露谷ios网络权限"
        />

        <Divider my={3} />

        <Text>
          如果出现无法移动的情况（这是游戏bug），让其他人随便送个东西给卡住的人（送东西流程：左右拇指将画面最大化，物品栏点个物品对着卡住的人连点几下就可以送东西，卡住的人收礼就可以行动了
        </Text>

        <Divider my={3} />

        <Text>
          下图是移动端1.6.X解锁联机模式的方法，搬自官网，需要点问号切英文才有4片叶子
        </Text>

        <Image
          src="/images/stardewValley/星露谷1.6.X移动端解锁联机模式方法.jpg"
          alt="星露谷1.6.X移动端解锁联机模式方法"
        />

        <Divider my={3} />

        <Button
          bgColor="#b23333"
          onClick={() => {
            router.back();
          }}
        >
          返回
        </Button>
      </Flex>
    </Center>
  );
}
