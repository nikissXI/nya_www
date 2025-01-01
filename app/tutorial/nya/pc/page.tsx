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
import { useState } from "react";
import { getAuthToken } from "@/store/authKey";
import { openToast } from "@/components/universal/toast";
import { WarningText } from "@/components/tutorial/PlayWarning";

export default function Page() {
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const wg_msi_url = process.env.NEXT_PUBLIC_WG_PC_URL; // 从环境变量获取 API 地址
  const bat_url = process.env.NEXT_PUBLIC_BAT_URL; // 从环境变量获取 API 地址
  const bat_fix_url = process.env.NEXT_PUBLIC_BAT_FIX_URL; // 从环境变量获取 API 地址

  const { logined, userInfo, getWgnum } = useUserStateStore();
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
          <ListItem>
            点击下方按钮下载conf文件 <br />
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
                    onClick={getWgnum}
                    bgColor="#007bc0"
                    size="sm"
                  >
                    点击获取编号
                  </Button>
                )}
              </>
            ) : (
              <Button bgColor="#1d984b" size="sm" onClick={loginToggle} ml={5}>
                登陆才能下载
              </Button>
            )}
          </ListItem>

          <ListItem>在左下角点新建隧道，选刚下载的conf文件，完成导入</ListItem>

          <ListItem>点连接按钮，连上喵服</ListItem>
        </List>

        <Image
          src={images[currentIndex]}
          alt={`Image ${currentIndex + 1}`}
          objectFit="cover"
          mx={4} // 设置图片左右间距
        />

        <Button size="sm" onClick={handleNext} disabled={images.length <= 1}>
          点击切换图片
        </Button>

        <Divider my={5} />

        <List spacing={2}>
          <ListItem>
            如果连接出现报错“Unable to create network
            adapter”，就下载这个bat文件，然后右键“以管理员身份运行”
          </ListItem>

          <ListItem>
            <Button
              size="sm"
              onClick={() => {
                window.open(bat_fix_url, "_blank");
              }}
            >
              点击下载修复脚本
            </Button>
          </ListItem>

          <ListItem>
            这是装过VMware虚拟机导致的，运行这个bat修复就行，如果能正常连接就不用管
          </ListItem>
        </List>

        <Divider my={5} />

        {/* <Heading size="md" mb={3}>
          允许ping协议通过防火墙
        </Heading>
        <List spacing={2}>
          <ListItem>
            下载这个bat文件，然后右键“以管理员身份运行”，不运行该文件会ping失败导致显示离线。如果系统没运行防火墙可以忽略这一步（像网吧的机子一般没有）。
          </ListItem>

          <ListItem>
            <Button
              size="sm"
              onClick={() => {
                window.open(bat_url, "_blank");
              }}
            >
              点击下载防火墙脚本
            </Button>
          </ListItem>
          <Image src="/images/run_bat.png" alt="run_bat" />
          <Image src="/images/run_bat_success.png" alt="run_bat_success" />
        </List>

        <Divider my={5} /> */}

        <Heading size="md" mb={3}>
          注意事项
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
