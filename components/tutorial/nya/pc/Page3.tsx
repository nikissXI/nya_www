"use client";

import { Flex, Center, List, ListItem, Heading, Image } from "@chakra-ui/react";
import { Button } from "@/components/universal/button";

export function Page() {
  const key = localStorage.getItem("key");

  const bat_url = process.env.NEXT_PUBLIC_BAT_URL; // 从环境变量获取 API 地址

  return (
    <Center>
      <Flex
        direction="column"
        justifyContent="space-between"
        alignItems="center"
        maxW="460px"
      >
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
              isDisabled={key ? false : true}
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
          <Image src="/images/run_bat_success.png" alt="run_bat_success" />
        </List>
      </Flex>
    </Center>
  );
}
