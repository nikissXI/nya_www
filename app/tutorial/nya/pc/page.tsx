"use client";
import { useRouter } from "next/navigation";
import { Flex, Center, Heading } from "@chakra-ui/react";
import { Button } from "@/components/universal/button";
import HeadingText from "@/components/tutorial/TutorialHeading";

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
        <HeadingText />

        <Heading size="md" mt={5}>
          Windows只支持win10和win11
          <br />
          苹果电脑也行但我没买做不了教程
        </Heading>

        <Button
          mt={10}
          w="160px"
          h="70px"
          bgColor="#c54572"
          fontSize="40px"
          onClick={() => {
            window.open(
              "https://www.bilibili.com/video/BV1MK4y1s7mS?p=3",
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
            router.push("/tutorial/nya/pc/1");
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