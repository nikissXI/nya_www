"use client";
import { useRouter } from "next/navigation";
import {
  Heading,
  VStack,
  Text,
  Divider,
  Input,
  Flex,
  Center,
  Image,
} from "@chakra-ui/react";
import { Button } from "@/components/universal/button";
import { useState } from "react";
import { useUserStateStore } from "@/store/user-state";
import { openToast } from "@/components/universal/toast";
import { getAuthToken } from "@/store/authKey";
import { isInteger } from "@/utils/strings";

export default function AndroidPage0() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();
  const { logined, setShowLoginModal } = useUserStateStore();
  const [inputNum, setInputNum] = useState("");
  const [showText, setShowText] = useState("");

  const createHelper = async (hosterWgnum: string) => {
    if (!hosterWgnum) {
      return;
    }

    if (!isInteger(hosterWgnum)) {
      openToast({ content: `请输入正确的编号`, status: "warning" });
      return;
    }

    const resp = await fetch(
      `${apiUrl}/escapistsHelper?hosterWgnum=${hosterWgnum}`,
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
      <VStack spacing={3} mx="5vw">
        <Button
          size="sm"
          bgColor="#c1447d"
          onClick={() => {
            window.open("https://b23.tv/2dcjPHv", "_blank");
          }}
        >
          点击查看视频演示
        </Button>

        <Text>由于这逃脱者的联机机制很傻逼，想联机就认真看教程的每个字！</Text>

        <Text>
          需要连接WiFi才可以进行多人游戏，否则会出现如图报错。
          <Image
            h="5rem"
            src="/images/theEscapists/theEscapists_lan_error.jpg"
            alt="theEscapists_lan_error"
          />
        </Text>

        <Text>
          主机连上喵服后创建多人游戏就行，客机加入需要创建搜索任务才能搜索到房间
        </Text>
        <Text>
          创建搜索任务有两种方法，二选一即可，一种在网页操作，一种在QQ里操作
        </Text>
        <Text>
          如果出现搜索不到的情况请联系服主处理，最后一次测试时间2025/05/04，版本是1.2.32，仅测试了正版（即付费购买的），破解版联机问题概不负责。
        </Text>

        <Divider my={2} />

        <Heading size="md">方法一（网页操作）</Heading>
        <Text>
          在下方填写要加入的玩家联机编号，如要搜索2号创建的多人游戏，就填“2”然后点提交
        </Text>

        <Flex>
          {logined ? (
            <Flex>
              <Input
                w="130px"
                type="number"
                value={inputNum}
                onChange={(e) => {
                  setInputNum(e.target.value);
                }}
                placeholder="要加入的编号"
              />

              <Button
                onClick={() => {
                  createHelper(inputNum);
                }}
              >
                提交
              </Button>
            </Flex>
          ) : (
            <Button bgColor="#1d984b" size="sm" onClick={setShowLoginModal}>
              请登录后再操作，点击登录
            </Button>
          )}
        </Flex>

        <Text color="#ffd648">{showText}</Text>

        <Divider my={2} />

        <Heading size="md">方法二（QQ群操作）</Heading>
        <Text>
          加入QQ群961793250，在群里发命令“搜索”，如要搜索2号创建的多人游戏，就发“搜索2”，机器人会给对应提示
        </Text>

        <Divider my={2} />

        <Text>
          如果出现以下提示，有两种情况，要么是主机切窗口导致游戏变离线模式，要么是游戏版本号不一致。
          <Image
            h="5rem"
            src="/images/theEscapists/theEscapists_session_error.jpg"
            alt="theEscapists_session_error"
          />
        </Text>

        <Divider my={2} />

        <Button
          mb={5}
          bgColor="#b23333"
          onClick={() => {
            router.back();
          }}
        >
          返回
        </Button>
      </VStack>
    </Center>
  );
}
