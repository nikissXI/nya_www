"use client";

import { Flex, Box, Center, Text } from "@chakra-ui/react";
import { Button } from "@/components/universal/button";
import { useRouter } from "next/navigation";

export default function Page({ params }: { params: { page: number } }) {
  const { page } = params;
  const pageId = Number(page);

  const router = useRouter();

  // const pageMap: { [key: number]: JSX.Element } = {
  //   1: <Page1 />,
  // };

  // const pageCount = Object.keys(pageMap).length;
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
            玩家都处于一个联机房间后，进游戏创建或加入就行
            <br />
            加入者也可以填房主的喵服IP加入，加入的时候房主别把游戏后台
            <br />
            支持安卓、苹果一起联机，电脑只能跟电脑联机
            <br />
            要把前面的序章打完才会解锁联机功能
          </Text>

          <Button
            size="sm"
            onClick={() => {
              window.open(
                "https://www.bilibili.com/video/BV1FLeJeNEq6/",
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
                router.push(`/tutorial`);
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
