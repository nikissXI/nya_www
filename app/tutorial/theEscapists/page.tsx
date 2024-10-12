"use client";
import { useRouter } from "next/navigation";
import {
  Heading,
  VStack,
  Text,
  Box,
  Input,
  Flex,
  Center,
} from "@chakra-ui/react";
import { Button } from "@/components/universal/button";
import { useState } from "react";
import { useUserStateStore } from "@/store/user-state";
import { useDisclosureStore } from "@/store/disclosure";
import { openToast } from "@/components/universal/toast";
import { getAuthToken } from "@/store/authKey";
import { isInteger } from "@/utils/strings";

export default function AndroidPage0() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();
  const { logined } = useUserStateStore();
  const [inputNum, setInputNum] = useState("");
  const [showText, setShowText] = useState("");

  const { onToggle: loginToggle } = useDisclosureStore((state) => {
    return state.modifyLoginDisclosure;
  });

  const createHelper = async (hosterWgnum: string) => {
    if (!hosterWgnum) {
      return;
    }

    if (!isInteger(hosterWgnum)) {
      openToast({ content: `请输入正确的编号` });
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
      <VStack spacing={3} maxW={{ base: "90vw", md: "400px" }}>
        {/* <Text align="center">
        由于该游戏的联机机制特殊
        <br />
        需要额外工具辅助才能建房
        <br />
        想联机就认真看教程
      </Text>

      <Text align="center">
        加Q群961793250
        <br />
        群里有机器人给开房提示，便于联机
        <br />
        支持安卓和苹果联机
        <br />
        不建议iPhone做房主，其他人很难加入
      </Text> */}

        <Button
          size="sm"
          bgColor="#c1447d"
          onClick={() => {
            window.open("https://b23.tv/2dcjPHv", "_blank");
          }}
        >
          点击查看视频教程
        </Button>

        <Text>
          由于这游戏的联机机制很傻逼，联机需要辅助手段，喵服这边已经给你做了最简化操作
        </Text>
        <Text>
          房主那边连上喵服后进游戏创建多人游戏就行，加入者那边需要用下面两种方式中的一种才能搜索到房间
        </Text>
        <Text>
          两种方式本质上是一样的，只不过一种在网页操作，一种在QQ里操作
        </Text>
        <Text>
          每次搜索房间都得操作一遍，你不要觉得麻烦，这是全网最简单的操作了，懒的搞就换个游戏吧。
        </Text>
        <Text>
          如果出现搜索不到的情况请联系群主处理，因为我只拿了个别版本测试。
        </Text>

        <Heading size="md" mt={2}>
          方式一（网页操作）
        </Heading>
        <Text>
          在下方填写要加入的编号（不是喵服联机房间的房主编号，别搞混了），如要搜索2号创建的多人游戏，就填“2”然后点提交
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
            <Button bgColor="#1d984b" size="sm" onClick={loginToggle}>
              请登录后再操作，点击登录
            </Button>
          )}
        </Flex>

        <Text color="#ffd648">{showText}</Text>

        <Heading size="md" mt={2}>
          方式二（QQ群操作）
        </Heading>
        <Text>
          加入QQ群961793250，在群里发命令“搜索”，如要搜索2号创建的多人游戏，就发“搜索2”，机器人会给对应提示
        </Text>

        {/* <Button
        p={7}
        bgColor="#148f14"
        fontSize="30px"
        onClick={() => {
          router.push("/tutorial/theEscapists/android/1");
        }}
      >
        安卓
      </Button>

      <Button
        p={7}
        bgColor="#2383c2"
        fontSize="30px"
        onClick={() => {
          router.push("/tutorial/theEscapists/ios/1");
        }}
      >
        苹果
      </Button> */}

        <Button
          size="lg"
          variant="link"
          bgColor="transparent"
          onClick={() => {
            router.push("/room");
          }}
        >
          返回
        </Button>
      </VStack>
    </Center>
  );
}
