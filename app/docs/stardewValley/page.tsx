"use client";

import {
  Flex,
  Center,
  Divider,
  Text,
  Image,
  Input,
  List,
  ListItem,
  ListIcon,
} from "@chakra-ui/react";
import { Button } from "@/components/universal/button";
import { useRouter } from "next/navigation";
import { useUserStateStore } from "@/store/user-state";
import { useState } from "react";
import { getAuthToken } from "@/store/authKey";
import { MdTipsAndUpdates } from "react-icons/md";

export default function Page() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();
  const { userInfo, setShowLoginModal } = useUserStateStore();
  const [inputIp, setInputIp] = useState("");
  const [showText, setShowText] = useState("");

  const createTask = async (hosterIp: string) => {
    if (!hosterIp) {
      return;
    }

    const resp = await fetch(
      `${apiUrl}/stardewValleyRoomCheck?hosterIp=${hosterIp}`,
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
          <br />
          仅作辅助，图文还是得看
        </Button>

        <List spacing={3} mt={5}>
          <ListItem>
            <ListIcon as={MdTipsAndUpdates} />
            玩家都处于同个联机房间后，主机主持农场，客机填主机的喵服IP加入即可
          </ListItem>
          <ListItem>
            <ListIcon as={MdTipsAndUpdates} />
            只要游戏版本号一致，就可以一起联机，不论安卓、苹果、PC；Windows系统主持农场如果其他人加入不了，检查系统防火墙是否放通了星露谷
          </ListItem>
          <ListItem>
            <ListIcon as={MdTipsAndUpdates} />
            如果是带mod联机，需要主机和客机装的mod一样，否则容易卡死或闪退
          </ListItem>
          <ListItem>
            <ListIcon as={MdTipsAndUpdates} />
            星露谷1.6版本开始内置联机功能，如果没解锁，看本页面最下方的解锁方法
          </ListItem>
          <ListItem>
            <ListIcon as={MdTipsAndUpdates} />
            如果游戏里卡住无法移动（这是游戏bug），除房主以外的人使用点击操作（砍伐树木、挖矿、锄远古斑点等操作）的时候有概率卡住罚站，队友给予任意物品即可解除，也可以在设置界面换成摇杆加按钮操作，不用点击交互，即可避免卡住罚站，更多的方法和原因可以自己去小红书啥的搜搜
          </ListItem>
          <ListItem>
            <ListIcon as={MdTipsAndUpdates} />
            如果都在线仍然加入失败，检查这些点
            <br />
            1、客机加入的时候，主机游戏不能放后台
            <br />
            2、如果是苹果设备需要给星露谷网络权限
            <br />
            3、主机大退游戏重新主持农场（大退的意思：完全退出游戏再重新打开游戏），这是游戏的bug，主机有概率卡bug其他无法加入，一次不行就继续
            <br />
            4、换一个人主持农场，或新建一个农场试试
            <br />
            5、使用下方的查房功能，每个玩家都主持一次农场，测试农场是否能被搜索，谁的农场搜不到就是谁的问题
          </ListItem>
        </List>

        <Divider my={3} />

        <Text>
          用于检测星露谷房间是否能被搜索，在输入框填写农场主的ip，
          如检查100.64.0.1这个ip能否加入，就填100.64.0.1然后点查房。
        </Text>

        <Flex>
          {userInfo ? (
            <Flex>
              <Input
                w="200px"
                type="text"
                value={inputIp}
                onChange={(e) => {
                  setInputIp(e.target.value);
                }}
                placeholder="农场主ip"
              />

              <Button
                onClick={() => {
                  createTask(inputIp);
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

        {/* <Text>
          iPhone玩家如果联机失败，检查星露谷是否有无线数据的权限（在设置里看，如下图），如果没有就无法联机（iPad没有这个，但也有这种问题）。一般第一次打开游戏会有个网络权限申请弹框，如果没有的话自己捣鼓一下怎么开吧，属于游戏问题，没正确申请联网权限。
        </Text>

        <Image
          src="/images/stardewValley/星露谷ios网络权限.png"
          alt="星露谷ios网络权限"
        /> 

        <Text>
          如果出现无法移动的情况（这是游戏bug），让其他人随便送个东西给卡住的人（送东西流程：左右拇指将画面最大化，物品栏点个物品对着卡住的人连点几下就可以送东西，卡住的人收礼就可以行动了
        </Text> */}

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
