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
// import { GetConfUrl } from "@/components/universal/GetConf";
import { useState } from "react";
import { getAuthToken } from "@/store/authKey";
import { openToast } from "@/components/universal/toast";

export default function Page() {
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const wg_msi_url = process.env.NEXT_PUBLIC_WG_PC_URL; // 从环境变量获取 API 地址
  const bat_url = process.env.NEXT_PUBLIC_BAT_URL; // 从环境变量获取 API 地址

  const { logined, userInfo } = useUserStateStore();
  const { onToggle: loginToggle } = useDisclosureStore((state) => {
    return state.modifyLoginDisclosure;
  });

  const images = ["/images/pc_switch_off.jpg", "/images/pc_switch_on.jpg"];

  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

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
        window.open(`${apiUrl}/downloadConf?key=${data.key}`, "_blank");
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
        mb={5}
        mx="5vw"
        maxW="460px"
        minH="50vh"
      >
        <Heading size="sm">
          Windows只支持win10和win11
          <br />
          苹果电脑也行，去下一个WG就行
          <br />
          教程用windows演示（我没Mac）
        </Heading>

        <Divider my={3} />

        <Heading size="md" mb={3}>
          下载并安装WG
        </Heading>

        <Button
          size="sm"
          onClick={() => {
            window.open(wg_msi_url, "_blank");
          }}
        >
          点击下载WG安装包
        </Button>

        <Text my={3}>WG全称WireGuard，这是安装成功的图</Text>
        <Image src="/images/msi_img.jpg" alt="msi_img" />

        <Divider my={5} />

        <Heading size="md" mb={3}>
          下载并导入conf（配置文件）
        </Heading>

        <List spacing={2}>
          <ListItem>点击下方按钮下载conf文件</ListItem>
          <ListItem>
            <Button
              size="sm"
              // onClick={() => GetConfUrl(userInfo?.wg_data.wgnum as number)}
              onClick={downloadConf}
              isDisabled={logined ? false : true}
            >
              {logined ? "点击下载conf" : "未登录无法下载"}
            </Button>

            {!logined && (
              <Button bgColor="#1d984b" size="sm" onClick={loginToggle} ml={5}>
                点击进行登陆
              </Button>
            )}
          </ListItem>
          <ListItem>
            在左下角点新建隧道，然后选下载的conf文件，完成导入
          </ListItem>
          <ListItem>点连接按钮，连上喵服</ListItem>
        </List>

        <Image
          src={images[currentIndex]}
          alt={`Image ${currentIndex + 1}`}
          objectFit="cover"
          mx={4} // 设置图片左右间距
        />

        <Button onClick={handleNext} disabled={images.length <= 1}>
          点击切换图片
        </Button>

        <Divider my={5} />

        <Heading size="md" mb={3}>
          允许ping协议通过防火墙
        </Heading>
        <List spacing={2}>
          <ListItem>
            下载这个bat文件，然后右键“以管理员身份运行”，不运行该文件会导致检测失败
          </ListItem>

          <ListItem>
            <Button
              size="sm"
              onClick={() => {
                window.open(bat_url, "_blank");
              }}
            >
              点击下载bat
            </Button>
          </ListItem>
          <Image src="/images/run_bat.png" alt="run_bat" />

          <ListItem>
            如果浏览器把文件拦截了不知道怎么点，可以看视频教程，全程录屏
          </ListItem>
          <ListItem>
            运行这个文件可能会被杀毒软件拦截，如果不放心可以用txt看里面写的什么内容
          </ListItem>
          <Image src="/images/run_bat_success.jpg" alt="run_bat_success" />
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