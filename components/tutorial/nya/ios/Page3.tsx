"use client";

import { Flex, Center, List, ListItem, Image, Heading } from "@chakra-ui/react";
import { Button } from "@/components/universal/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/universal/AuthContext";

export function Page() {
  const router = useRouter();

  const [contDownloadUrl, setContDownloadUrl] = useState<string>("");

  const { isLoggedIn } = useAuth();

  useEffect(() => {
    const key = localStorage.getItem("key");
    if (key) {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      setContDownloadUrl(`${apiUrl}/d?k=${key}&r=${Math.random()}`);
    }
  }, [setContDownloadUrl]);

  return (
    <Center>
      <Flex
        direction="column"
        justifyContent="space-between"
        alignItems="center"
        maxW="460px"
      >
        <Heading size="md" mb={3}>
          下载并导入conf（配置文件）
        </Heading>

        <List spacing={2}>
          <ListItem>
            点击下方按钮下载conf文件，如果下载不了就换Safari浏览器
          </ListItem>
          <ListItem>
            <Button
              size="sm"
              onClick={() => {
                window.open(contDownloadUrl, "_blank");
              }}
              isDisabled={isLoggedIn ? false : true}
            >
              {isLoggedIn ? "点击下载conf" : "未登录无法下载"}
            </Button>
            <Button
              bgColor="#1d984b"
              size="sm"
              onClick={() => {
                router.push("/wgnum/bind");
              }}
              visibility={isLoggedIn ? "hidden" : "visible"}
              ml={5}
            >
              点击进行登陆
            </Button>
          </ListItem>

          <ListItem>
            运行WG，点添加隧道，选导入配置，在最近项目里选刚下载的conf文件，完成导入
          </ListItem>
          <ListItem>
            打开开关，连上喵服
            <Image my={3} src="/images/ios_switch.jpg" alt="ios_switch" />
          </ListItem>
        </List>
      </Flex>
    </Center>
  );
}
