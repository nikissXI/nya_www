"use client";

import {
  Flex,
  Center,
  List,
  ListItem,
  Image,
  Heading,
  Box,
} from "@chakra-ui/react";
import { Button } from "@/components/universal/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStateStore } from "@/store/user-state";
import { GetConfUrl } from "@/components/universal/GetConf";

export function Page() {
  const router = useRouter();

  const { logined, userInfo } = useUserStateStore();

  const images = ["/images/pc_switch_off.jpg", "/images/pc_switch_on.jpg"];

  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
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
          下载并导入conf（配置文件）
        </Heading>

        <List spacing={2}>
          <ListItem>点击下方按钮下载conf文件</ListItem>
          <ListItem>
            <Button
              size="sm"
              onClick={() => GetConfUrl(userInfo?.wg_data.wgnum as number)}
              isDisabled={logined ? false : true}
            >
              {logined ? "点击下载conf" : "未登录无法下载"}
            </Button>
            <Button
              bgColor="#1d984b"
              size="sm"
              onClick={() => {
                router.push("/wgnum/bind");
              }}
              visibility={logined ? "hidden" : "visible"}
              ml={5}
            >
              点击进行登陆
            </Button>
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
      </Flex>
    </Center>
  );
}
