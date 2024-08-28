"use client";

import { Center, Box, Stack, Heading } from "@chakra-ui/react";
import { Button } from "@/components/universal/button";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();

  return (
    <Box pt={3} textAlign="center">

      <Heading my={6}>请选择系统</Heading>
      <Center>
        <Stack spacing={10} w="160px">
          <Button
            h="70px"
            bgColor="#148f14"
            fontSize="40px"
            onClick={() => {
              router.push("/tutorial/android");
            }}
          >
            安卓
          </Button>

          <Button
            h="70px"
            bgColor="#2383c2"
            fontSize="40px"
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
