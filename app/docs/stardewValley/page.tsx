"use client";

import { Flex, Center, Divider, Text, Image, Input } from "@chakra-ui/react";
import { Button } from "@/components/universal/button";
import { useRouter } from "next/navigation";
import { useUserStateStore } from "@/store/user-state";
import { useState } from "react";
import { getAuthToken } from "@/store/authKey";

export default function Page() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();
  const { logined, setShowLoginModal } = useUserStateStore();
  const [inputNum, setInputNum] = useState("");
  const [showText, setShowText] = useState("");

  const createTask = async (hosterWgnum: string) => {
    if (!hosterWgnum) {
      return;
    }

    const resp = await fetch(
      `${apiUrl}/stardewValleyRoomCheck?hosterWgnum=${hosterWgnum}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );

    if (resp.ok) {
      const data = await resp.json();
      if (data.code === 0) {
        setShowText(data.msg);
      } else {
        setShowText(data.msg);
      }
    } else {
      setShowText("服务异常，若刷新仍旧异常，请联系服主处理");
    }
  };

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
          如果联机失败，先确认喵服是在线状态（WG连上），加入的时候游戏没有放后台，或尝试大退游戏再主持。
          <br />
          主持了农场就尽量别切出游戏，切出容易引发BUG（导致其他玩家无法加入）。
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
          此处可以检测星露谷房间是否能被搜索，在输入框填写主机的联机编号。
          如要检查12号创建的房间能否被搜索，就填12然后点查房。
          每个人都试试主持农场，谁的房间搜不到就是谁的问题。
        </Text>

        <Flex>
          {logined ? (
            <Flex>
              <Input
                w="200px"
                type="number"
                value={inputNum}
                onChange={(e) => {
                  setInputNum(e.target.value);
                }}
                placeholder="主机的联机编号"
              />

              <Button
                onClick={() => {
                  createTask(inputNum);
                  setShowText("搜索中请稍后。。。");
                }}
              >
                查房
              </Button>
            </Flex>
          ) : (
            <Button bgColor="#1d984b" size="sm" onClick={setShowLoginModal}>
              请登录后再操作，点击登录
            </Button>
          )}
        </Flex>

        <Text color="#ffd648">{showText}</Text>

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
