"use client";

import { Flex, Box, Center, Text } from "@chakra-ui/react";
import { Button } from "@/components/universal/button";
import { useRouter } from "next/navigation";

export default function Page({ params }: { params: { page: number } }) {
  const { page } = params;
  const pageId = Number(page);

  const router = useRouter();

  const pageCount = 1;

  return (
    <Flex
      direction="column"
      justifyContent="space-between"
      alignItems="center"
      mx="5vw"
      minH="50vh"
    >
      <Center>
        <Flex
          direction="column"
          justifyContent="space-between"
          alignItems="center"
          maxW="460px"
        >
          <Text my={3}>
            玩家都处于一个联机房间后，房主主持农场（就是创建联机房间），其他玩家填房主的喵服IP加入即可
            <br />
            加入的时候房主别把游戏后台
            <br />
            只能安卓和安卓联机，电脑和电脑联机
          </Text>

          <Button
            size="sm"
            bgColor="#c1447d"
            onClick={() => {
              window.open(
                "https://www.bilibili.com/video/BV1U1eGe8Eka/",
                "_blank"
              );
            }}
          >
            点击查看视频教程
          </Button>
        </Flex>
      </Center>

      <Flex justifyContent="space-between" direction="column" mb={6}>
        <Center mt={6} mb={2}>
          教程进度 {pageId}/{pageCount}
        </Center>
        <Flex>
          <Box width="100%">
            <Button
              bgColor="#e87f2c"
              visibility={pageId > 1 ? "visible" : "hidden"}
              onClick={() => {
                router.push(`${pageId - 1}`);
              }}
            >
              上一步
            </Button>
          </Box>

          <Box width="100%" mx={5}>
            <Button
              bgColor="#b23333"
              onClick={() => {
                router.push(`/room`);
              }}
            >
              返回
            </Button>
          </Box>

          <Box width="100%">
            <Button
              bgColor="#30ad2a"
              visibility={pageId < pageCount ? "visible" : "hidden"}
              onClick={() => {
                router.push(`${pageId + 1}`);
              }}
            >
              下一步
            </Button>
          </Box>
        </Flex>
      </Flex>
    </Flex>
  );
}
