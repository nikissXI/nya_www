"use client";
import { useRouter } from "next/navigation";
import { Flex, VStack, Heading } from "@chakra-ui/react";
import { Button } from "@/components/universal/button";
import HeadingText from "@/components/tutorial/TutorialHeading";

export default function AndroidPage0() {
  const router = useRouter();

  return (
    <VStack spacing={6}>
      <HeadingText />

      <Heading size="sm">
        Windows只支持win10和win11
        <br />
        苹果电脑也行，去下一个WG就行
      </Heading>

      <Button
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
        size="sm"
        bgColor="#b23333"
        onClick={() => {
          router.push("/tutorial");
        }}
      >
        返回
      </Button>
    </VStack>
  );
}
