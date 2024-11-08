"use client";

import {
  Flex,
  Center,
  Text,
  Divider,
  Heading,
  List,
  ListItem,
  Image,
} from "@chakra-ui/react";
import { Button } from "@/components/universal/button";
import { useRouter } from "next/navigation";
import { useDisclosureStore } from "@/store/disclosure";
import { useUserStateStore } from "@/store/user-state";
import { GetConfUrl } from "@/components/universal/GetConf";
import { getAuthToken } from "@/store/authKey";
import { openToast } from "@/components/universal/toast";

export default function Page() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();
  const { logined, userInfo } = useUserStateStore();
  const { onToggle: loginToggle } = useDisclosureStore((state) => {
    return state.modifyLoginDisclosure;
  });

  const { onToggle: getWgnumToggle } = useDisclosureStore((state) => {
    return state.modifyGetWgnumDisclosure;
  });

  const downloadConf = async () => {
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
        // 用拿到的data.key下载conf
        window.open(`${apiUrl}/downloadConf2?key=${data.key}`, "_blank");
      } else {
        openToast({ content: data.msg, status: "warning" });
      }
    } else if (resp.status === 401) {
      openToast({ content: "登陆凭证无效", status: "warning" });
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
          准备一个外区ID
        </Heading>

        <List spacing={2}>
          <ListItem>连接喵服用的软件叫WireGuard（简称WG）</ListItem>
          <ListItem>该软件需要外区ID（就是海外苹果账号）才能下载</ListItem>
          <ListItem>
            如果没有外区ID或不知道这是什么，可以礼貌地私聊服主（就是群主）找他借
          </ListItem>
          <ListItem>认真跟着教程操作几分钟就搞完了，耐心点</ListItem>
        </List>

        <Divider my={5} />

        <Heading size="md" mb={3}>
          下载并安装WG
        </Heading>

        <List spacing={2}>
          <ListItem>准备好外区ID后，跟着下图操作</ListItem>
          <ListItem>看不懂就去看视频教程，有完整操作录屏</ListItem>
          <Image my={3} src="/images/ios_install_wg.jpg" alt="ios_install_wg" />
        </List>

        <Divider my={5} />

        <Heading size="md" mb={3}>
          下载并导入conf（配置文件）
        </Heading>

        <List spacing={2}>
          <ListItem>
            点击下方按钮下载conf文件，请使用Safari浏览器下载
            <br />
            两个通道都能下载，1不行就用2
          </ListItem>
          <ListItem>
            {logined ? (
              <>
                {userInfo?.wg_data ? (
                  <>
                    <Button
                      size="sm"
                      onClick={() =>
                        GetConfUrl(userInfo.wg_data?.wgnum as number)
                      }
                      isDisabled={logined ? false : true}
                    >
                      下载通道1
                    </Button>

                    <Button
                      ml={5}
                      size="sm"
                      onClick={downloadConf}
                      isDisabled={logined ? false : true}
                    >
                      下载通道2
                    </Button>
                  </>
                ) : (
                  <Button
                    rounded={5}
                    onClick={getWgnumToggle}
                    bgColor="#007bc0"
                    size="sm"
                  >
                    你还没获取编号
                  </Button>
                )}
              </>
            ) : (
              <Button bgColor="#1d984b" size="sm" onClick={loginToggle} ml={5}>
                登陆才能下载
              </Button>
            )}
          </ListItem>

          <ListItem>
            运行WG，点添加隧道，选导入配置，在最近项目里选刚下载的conf文件，完成导入
          </ListItem>
          <ListItem>
            打开开关，连上喵服
            <Image my={3} src="/images/ios_switch.jpg" alt="ios_switch" />
          </ListItem>
        </List>

        <Divider my={5} />

        <Heading size="md" mb={3}>
          使用联机房间开始联机
        </Heading>

        <Text mx={5}>
          现在可以返回联机房间界面查看是否连上喵服了
          <br />
          看一看注意事项的内容，或许能带来帮助
          <br />
          联机的玩家都要跟着教程安装WG连上服务器
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
