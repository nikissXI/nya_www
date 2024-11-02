"use client";

import { useRouter } from "next/navigation";
import {
  Flex,
  Center,
  Text,
  Divider,
  Heading,
  VStack,
  Box,
  List,
  ListItem,
  Collapse,
  Image,
} from "@chakra-ui/react";
import { Button } from "@/components/universal/button";
import { useState } from "react";
import { useUserStateStore } from "@/store/user-state";
import { getAuthToken } from "@/store/authKey";
import { useDisclosureStore } from "@/store/disclosure";
import { openToast } from "@/components/universal/toast";

export default function Page() {
  const wg_apk_url = process.env.NEXT_PUBLIC_WG_APK_URL; // 从环境变量获取 API 地址
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

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
      openToast({ content: String(err), status: "warning" });
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
        openToast({ content: data.msg, status: "warning" });
      }
    } else {
      openToast({ content: "服务异常，请联系服主处理", status: "error" });
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
        maxW="460px"
        minH="50vh"
      >
        <Heading size="md" mb={3}>
          下载并安装WG
        </Heading>

        <Text mb={3}>
          如果出现无法正常导入，请尝试来着下载新的（有时候版本升级，老版本就用不了），更新了还不行就找群主处理
        </Text>

        <Button
          size="sm"
          onClick={() => {
            window.open(wg_apk_url, "_blank");
          }}
        >
          点击下载WG安装包
        </Button>

        <Divider my={5} />

        <Heading size="md" mb={3}>
          获取conf key
        </Heading>

        <Text mb={3}>下一步导入用得上</Text>

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

        <Divider my={5} />

        <Heading size="md" mb={3}>
          导入编号并连上喵服
        </Heading>

        <List spacing={2}>
          <ListItem>步骤 1: 运行WireGuard，即WG</ListItem>
          <ListItem>步骤 2: 点击右下方的加号</ListItem>
          <ListItem>步骤 3: 点击“通过conf key导入”</ListItem>
          <ListItem>步骤 4: 粘贴上一步获取的conf key完成导入</ListItem>
          <ListItem>步骤 5: 把开关打开连上喵服</ListItem>
          <Image my={3} src="/images/android_switch.jpg" alt="android_switch" />
        </List>

        <Divider my={5} />

        <Heading size="md" mb={3}>
          小米（红米）手机或平板必看
        </Heading>

        <VStack spacing={0}>
          <Button
            mb={1}
            size="sm"
            bgColor="#d46500"
            fontSize="16px"
            onClick={() => setShowXM(!showXM)}
          >
            {showXM ? "点击收起" : "点击查看"}
          </Button>

          <Box
            mx={3}
            px={3}
            border="2px" // 边框宽度
            borderColor="#31b8ce" // 边框颜色
            borderRadius="md" // 边框圆角
          >
            <Collapse in={showXM}>
              <Text>
                游戏加速的“网络优化”会导致无法联机，即使已经显示已连接
                <br />
                关闭方法：找到系统的游戏加速，打开加速设置-&gt;性能增强-&gt;性能增强-&gt;把“WLAN网络优化”关闭
                <br />
                如下图（系统版本不同可能不一样，脑子灵活点）
              </Text>
              <Image src="/images/xiaomi.jpg" alt="xiaomi" borderRadius="md" />
            </Collapse>
          </Box>
        </VStack>

        <Divider my={5} />

        <Heading size="md" mb={3}>
          使用联机房间开始联机
        </Heading>

        <Text mx={5}>
          现在可以返回联机房间界面查看是否连上喵服了
          <br />
          看一看注意事项的内容，或许能带来帮助
          <br />
          喵服关联群的群主就是服主，如果遇到教程解决不了的问题就私聊他
        </Text>

        <Button
          h="40px"
          mt={3}
          size="md"
          bgColor="#992e98"
          onClick={() => {
            router.push("/room");
          }}
        >
          &gt;&gt; 前往联机房间 &lt;&lt;
        </Button>

        <Divider my={5} />

        <Button
          bgColor="#b23333"
          onClick={() => {
            router.push(`/tutorial`);
          }}
        >
          返回上一级
        </Button>
      </Flex>
    </Center>
  );
}
