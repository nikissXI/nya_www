"use client";

import { Center, Box, Stack, Heading } from "@chakra-ui/react";
import { Button } from "@/components/universal/button";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    <Box textAlign="center">
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

          <Button
            size="lg"
            variant="link"
            bgColor="transparent"
            onClick={() => {
              router.push("/room");
            }}
          >
            返回
          </Button>
        </Stack>
      </Center>
    </Box>
  );
}
