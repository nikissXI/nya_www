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
import { useState,useEffect } from "react";
import { useRouter } from "next/navigation";
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
