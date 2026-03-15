"use client";
import {
  Heading,
  Box,
  Text,
  Divider,
  Input,
  Flex,
  Image,
  Icon,
  List,
  ListItem,
  ListIcon,
} from "@chakra-ui/react";
import { Button } from "@/components/universal/button";
import { useState } from "react";
import { useUserStateStore } from "@/store/user-state";
import { getAuthToken } from "@/store/authKey";
import { MdTipsAndUpdates } from "react-icons/md";
import BackButton from "@/components/docs/BackButton";
import DocFlex from "@/components/docs/DocFlex";
import DocLink from "@/components/docs/DocLink";

export default function AndroidPage0() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const { userInfo, setShowLoginModal } = useUserStateStore();
  const [inputIp, setInputIp] = useState("");
  const [showText, setShowText] = useState("");

  const createHelper = async (hosterIp: string) => {
    if (!hosterIp) {
      return;
    }

    const resp = await fetch(`${apiUrl}/escapistsHelper?hosterIp=${hosterIp}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });

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

  const TextList = [
    "喵服关联QQ群：961793250",
    "连接WiFi才可以进行多人游戏，否则会出现错误“你需要网络连接到局域网会话”",
    "主机连上喵服后创建多人游戏就行，客机加入需要创建搜索任务才能搜索到房间，创建搜索任务有两种方式，接着往下看",
    "如果出现加入进去后提示“此会话已不可用”，有两种情况，要么是主机切窗口导致游戏变离线模式，要么是游戏版本号不一致",
    "如果出现搜索不到的情况联系服主处理，最后一次测试时间2025/12/15，安卓和苹果联机没问题，测试游戏均为东品代理的国服版本：安卓1.3.2，苹果版本1.70.2",
  ];

  return (
    <DocFlex>
      <Heading size="lg" textAlign="center">
        仅支持正版逃脱者手游联机
      </Heading>

      <DocLink
        linkText="简略视频演示"
        linkUrl="https://www.bilibili.com/video/BV13xijemE3L/"
      />

      {/* <Image
        h="5rem"
        src="/images/theEscapists/theEscapists_lan_error.jpg"
        alt="theEscapists_lan_error"
      /> */}
      <List spacing={2}>
        {TextList.map((reason, index) => (
          <ListItem key={index} textAlign="left">
            <ListIcon as={MdTipsAndUpdates} />
            {reason}
          </ListItem>
        ))}
      </List>
      <Divider my={4} />

      <Heading size="lg" mb={3}>
        创建搜索任务
      </Heading>

      <Box w="100%">
        <Heading size="md">方式一（网页操作）</Heading>
        如搜索联机ip为100.64.0.1创建的房间，就填“100.64.0.1”然后点搜索
        <Flex>
          {userInfo ? (
            <Flex>
              <Input
                w="160px"
                type="text"
                value={inputIp}
                onChange={(e) => {
                  setInputIp(e.target.value);
                }}
                placeholder="要加入的主机ip"
              />

              <Button
                onClick={() => {
                  createHelper(inputIp);
                }}
              >
                搜索
              </Button>
            </Flex>
          ) : (
            <Button bgColor="#1d984b" size="sm" onClick={setShowLoginModal}>
              请登录后再操作，点击登录
            </Button>
          )}
        </Flex>
        <Text color="#ffd648">{showText}</Text>
      </Box>

      <Box w="100%" mt={4}>
        <Heading size="md">方式二（QQ群操作）</Heading>
        加入QQ群961793250，在群里发命令“搜索”，如要搜索100.64.0.1房间，就发“搜索100.64.0.1”，机器人会给对应提示
      </Box>

      {/* 
        <Image
          h="5rem"
          src="/images/theEscapists/theEscapists_session_error.jpg"
          alt="theEscapists_session_error"
        /> */}

      <Divider my={5} />

      <BackButton />
    </DocFlex>
  );
}
