"use client";

import {
  Flex,
  Center,
  Text,
  Divider,
  Heading,
  VStack,
  Box,
  Collapse,
  Image,
} from "@chakra-ui/react";
import { Button } from "@/components/universal/button";
import { useState } from "react";
import { useUserStateStore } from "@/store/user-state";
import { getAuthToken } from "@/store/authKey";
import { useDisclosureStore } from "@/store/disclosure";
import { openToast } from "@/components/universal/toast";

export function Page() {
  const wg_apk_url = process.env.NEXT_PUBLIC_WG_APK_URL; // 从环境变量获取 API 地址
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const { logined } = useUserStateStore();
  const { onToggle: loginToggle } = useDisclosureStore((state) => {
    return state.modifyLoginDisclosure;
  });

  const [confKey, setConfKey] = useState("");
  const [getConfKeyText, setGetConfKeyText] = useState("");

  const [showXM, setShowXM] = useState(false);

  const handleCopyLink = async (confKey: string) => {
    setConfKey(confKey);
    try {
      if (navigator.clipboard && navigator.permissions) {
        await navigator.clipboard.writeText(confKey);
        setGetConfKeyText(
          "key已复制到剪切板，有效期15分钟，如果复制失败就手动复制"
        );
      } else {
        throw new Error("不支持自动复制");
      }
    } catch (err) {
      openToast({ content: String(err) });
      setGetConfKeyText("复制失败，请手动复制，key有效期15分钟");
    }
  };

  const getConfKey = async () => {
    const resp = await fetch(`${apiUrl}/getDownloadConfkey`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });

    if (resp.ok) {
      const data = await resp.json();
      if (data.code === 0) {
        handleCopyLink(data.key);
      } else {
        openToast({ content: data.msg });
      }
    } else {
      openToast({ content: "服务异常，请联系服主处理" });
    }
  };

  return (
    <Center>
      <Flex
        direction="column"
        justifyContent="space-between"
        alignItems="center"
        maxW="460px"
      >
        <Heading size="md" mb={3}>
          下载并安装WG
        </Heading>

        <Button
          size="sm"
          onClick={() => {
            window.open(wg_apk_url, "_blank");
          }}
        >
          点击下载WG安装包
        </Button>

        <Divider my={5}></Divider>

        <Heading size="md" mb={3}>
          获取conf key
        </Heading>

        <Flex>
          <Button
            size="sm"
            onClick={getConfKey}
            isDisabled={getConfKeyText ? true : false || logined ? false : true}
          >
            {logined ? "点击获取" : "未登录无法获取"}
          </Button>

          {!logined && (
            <Button bgColor="#1d984b" size="sm" onClick={loginToggle} ml={5}>
              点击进行登陆
            </Button>
          )}
        </Flex>

        <Text>{getConfKeyText}</Text>

        <Text color="#ffd648">{confKey}</Text>

        <Divider my={5}></Divider>

        <VStack spacing={0}>
          <Button
            w="160px"
            h="40px"
            mb={1}
            size="sm"
            bgColor="#d46500"
            fontSize="16px"
            onClick={() => setShowXM(!showXM)}
          >
            {showXM ? (
              "点击收起"
            ) : (
              <Text fontSize="sm">
                如果是小米/红米用户
                <br />
                请点我，不是请忽略
              </Text>
            )}
          </Button>

          <Box
            mx={3}
            px={3}
            border="2px" // 边框宽度
            borderColor="#31b8ce" // 边框颜色
            borderRadius="md" // 边框圆角
          >
            <Collapse in={showXM}>
              <Text fontSize="sm">
                MIUI的加速会拦截VPN流量，具体现象就是不进游戏没事，一进游戏就掉线
                <br />
                具体操作：找到系统的游戏加速，打开加速设置-&gt;性能增强-&gt;性能增强-&gt;把“WLAN网络优化”关闭
                <br />
                如下图（系统版本不同可能不一样，脑子灵活点）
              </Text>
              <Image src="/images/xiaomi.jpg" alt="xiaomi" borderRadius="md" />
            </Collapse>
          </Box>
        </VStack>
      </Flex>
    </Center>
  );
}
