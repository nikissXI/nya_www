"use client";

import { Center, Text, Box, Button, Stack, Heading } from "@chakra-ui/react";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();

  return (
    <Box pt={10} textAlign="center">
      <Heading mb={6}>请点击选择</Heading>
      <Center>
        <Stack spacing={10}>
          <Button
            colorScheme="teal"
            size="lg"
            variant="solid"
            onClick={() => {
              router.push("/wgnum/bind");
            }}
          >
            还没有编号，需要获取编号联机
          </Button>

          <Button
            colorScheme="orange"
            size="lg"
            variant="solid"
            onClick={() => {
              router.push("/wgnum/query");
            }}
          >
            只是来查询编号绑定信息
          </Button>

          <Button
            colorScheme="blue"
            size="lg"
            variant="solid"
            onClick={() => {
              router.push("/tutorial");
            }}
          >
            来看喵服怎么用的，需要教程
          </Button>
        </Stack>
      </Center>
    </Box>
  );
};

export default Page;
