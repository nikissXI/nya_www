"use client";

import { Center, Box, Stack, Heading, useDisclosure } from "@chakra-ui/react";
import { Button } from "@/components/universal/button";
import { useRouter } from "next/navigation";
import { GameListModal } from "@/components/tutorial/GameList";

export default function Page() {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box textAlign="center">
      <GameListModal isOpen={isOpen} onClose={onClose} />
      <Heading my={3}>
        请根据系统类型
        <br />
        查看连接喵服教程
      </Heading>
      <Center>
        <Stack spacing={6} w="160px">
          <Button
            h="70px"
            bgColor="#148f14"
            fontSize="40px"
            onClick={() => {
              router.push("/tutorial/nya/android");
            }}
          >
            安卓
          </Button>

          <Button
            h="70px"
            bgColor="#2383c2"
            fontSize="40px"
            onClick={() => {
              router.push("/tutorial/nya/ios");
            }}
          >
            苹果
          </Button>

          <Button
            h="70px"
            bgColor="#753030"
            fontSize="40px"
            onClick={() => {
              router.push("/tutorial/nya/pc");
            }}
          >
            电脑
          </Button>
        </Stack>
      </Center>

      <Center mt={6}>
        <Button h="60px" bgColor="#7242ad" fontSize="20px" onClick={onOpen}>
          目前已收录的
          <br />
          游戏联机教程
        </Button>
      </Center>
    </Box>
  );
}
