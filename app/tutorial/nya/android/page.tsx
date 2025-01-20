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
import { useState, useEffect } from "react";
import { useUserStateStore } from "@/store/user-state";
import { useDisclosureStore } from "@/store/disclosure";
import { openToast } from "@/components/universal/toast";
import { WarningText } from "@/components/tutorial/PlayWarning";

export default function Page() {
  const wg_apk_url = process.env.NEXT_PUBLIC_WG_APK_URL; // 从环境变量获取 API 地址
  const router = useRouter();

  const { logined, confKey, getConfKey } = useUserStateStore();
  const { onToggle: loginToggle } = useDisclosureStore((state) => {
    return state.modifyLoginDisclosure;
  });

  // const [getConfKeyText, setGetConfKeyText] = useState("");

  const [showXM, setShowXM] = useState(false);

  const handleCopyLink = async (confKey: string) => {
    try {
      if (navigator.clipboard && navigator.permissions) {
        await navigator.clipboard.writeText(confKey);
        // setGetConfKeyText(
        //   "key已复制到剪切板，有效期15分钟，如果复制失败就手动复制"
        // );
        openToast({ content: "key已复制到剪切板", status: "warning" });
      } else {
        throw new Error("不支持自动复制");
      }
    } catch (err) {
      // openToast({ content: String(err), status: "warning" });
      // setGetConfKeyText("复制失败，请手动复制，key有效期15分钟");
    }
  };

  useEffect(() => {
    if (logined) {
      getConfKey();
    }
  }, [logined]);

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
          请在浏览器中打开网站再点下载，不要在QQ、微信等其他非浏览器中下载
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
          导入隧道
        </Heading>

        <List spacing={2}>
          <ListItem>步骤 1: 运行WireGuard，即WG</ListItem>
          <ListItem>步骤 2: 点击右下方的加号</ListItem>
          <ListItem>步骤 3: 点击“通过conf key导入”</ListItem>
          <ListItem>
            步骤 4:{" "}
            {logined && confKey ? (
              <>
                粘贴这段代码（黄字）完成隧道导入
                <Button
                  color="#7dfffe"
                  fontWeight="normal"
                  variant="link"
                  bgColor="transparent"
                  onClick={() => {
                    getConfKey();
                  }}
                >
                  刷新
                </Button>
                <Text
                  color="#ffd648"
                  onClick={() => {
                    handleCopyLink(confKey);
                  }}
                  h="min"
                >
                  {confKey}
                </Text>
              </>
            ) : (
              <>
                请登录后再操作
                <Button
                  bgColor="#1d984b"
                  size="sm"
                  onClick={loginToggle}
                  ml={5}
                >
                  点击进行登陆
                </Button>
              </>
            )}
          </ListItem>
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
              <Text fontSize="sm">
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
          注意事项请认真阅读
        </Heading>

        <WarningText />

        <Button
          mt={3}
          size="sm"
          onClick={() => {
            router.push("/room");
          }}
        >
          &gt;&gt; 返回联机房间 &lt;&lt;
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
