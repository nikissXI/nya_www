"use client";
import { useRouter } from "next/navigation";
import { Flex, Center, Heading } from "@chakra-ui/react";
import { Button } from "@/components/universal";

export default function AndroidPage0() {
  const router = useRouter();

  return (
    <Center>
      <Flex
        direction="column"
        justifyContent="space-between"
        alignItems="center"
        mx={3}
      >
        <Heading mt={4} size="md" textAlign="center">
          视频教程更新没那么及时
          <br />
          但流程是大差不差的
          <br />
          具体以图文流程为准
        </Heading>

        <Button
          mt={10}
          w="160px"
          h="70px"
          bgColor="#c54572"
          fontSize="40px"
          onClick={() => {
            window.open(
              "https://www.bilibili.com/video/BV1MK4y1s7mS?p=1",
              "_blank"
            );
          }}
        >
          视频
        </Button>

        <Button
          mt={10}
          w="160px"
          h="70px"
          bgColor="#00987a"
          fontSize="40px"
          onClick={() => {
            router.push("/tutorial/android/1");
          }}
        >
          图文
        </Button>

        <Button
          mt={10}
          size="sm"
          bgColor="#b23333"
          onClick={() => {
            router.push("/tutorial");
          }}
        >
          返回
        </Button>
      </Flex>
    </Center>
  );
}
