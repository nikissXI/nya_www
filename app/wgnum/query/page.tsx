"use client";

import { Center, Text, Box, Button, Stack, Heading } from "@chakra-ui/react";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();

  return (
    <Box p={4} textAlign="center">
      <Heading mb={6}>请点击选择</Heading>
      <Center>
        <Stack spacing={4} maxW="300px">
          <Button
            colorScheme="teal"
            size="lg"
            variant="solid"
            width="100%"
            onClick={() => {
              router.push("/wgnum");
            }}
          >
            我还没有编号，需要获取编号联机
          </Button>
          <Button colorScheme="blue" size="lg" variant="solid" width="100%">
            我有编号，要下载conf文件
          </Button>
          <Button colorScheme="orange" size="lg" variant="solid" width="100%">
            我只是来查询编号绑定信息
          </Button>
        </Stack>
      </Center>
    </Box>
  );
};

export default Page;
