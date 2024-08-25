"use client";

import { Center,Flex, Button, Stack, Heading } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();

  return (
    <Flex pt={10} direction="column" justifyContent="space-between" alignItems="center">
      <Heading mb={6}>你要干啥呢</Heading>
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
    </Flex>
  );
};

export default Page;
