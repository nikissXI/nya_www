"use client";

import { Center, Box, Button, Stack, Heading } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
const Page = () => {
  const router = useRouter();


  return (
    <Box pt={10} textAlign="center">
      <Heading my={6}>请选择系统</Heading>
      <Center>
        <Stack spacing={10} w="160px">
          <Button
            h="70px"
            bgColor="#148f14"
            fontSize="40px"
            variant="solid"
            onClick={() => {
              router.push("/tutorial/android/0");
            }}
          >
            安卓
          </Button>

          <Button
            h="70px"
            bgColor="#2383c2"
            fontSize="40px"
            variant="solid"
            onClick={() => {
              router.push("/tutorial/ios");
            }}
          >
            苹果
          </Button>

          <Button
            h="70px"
            bgColor="#753030"
            fontSize="40px"
            variant="solid"
            onClick={() => {
              router.push("/tutorial/pc");
            }}
          >
            电脑
          </Button>
        </Stack>
      </Center>
    </Box>
  );
};

export default Page;
