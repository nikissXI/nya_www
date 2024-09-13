"use client";

import { Flex, Center, List, ListItem, Image, Heading } from "@chakra-ui/react";
import { Button } from "@/components/universal/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/universal/AuthContext";
import { GetConfUrl } from "@/components/universal/GetConf";

export function Page() {
  const router = useRouter();

  const { isLoggedIn, wgnum } = useAuth();

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
              onClick={() => GetConfUrl(wgnum)}
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
