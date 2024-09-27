"use client";
import { useRouter } from "next/navigation";
import { Flex, Center, VStack } from "@chakra-ui/react";
import { Button } from "@/components/universal/button";
import HeadingText from "@/components/tutorial/TutorialHeading";

export default function AndroidPage0() {
  const router = useRouter();

  return (
    <VStack spacing={6}>
      <HeadingText />

      <Button
        w="160px"
        h="70px"
        bgColor="#c54572"
        fontSize="40px"
        onClick={() => {
          window.open(
            "https://www.bilibili.com/video/BV1MK4y1s7mS?p=2",
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
          router.push("/tutorial/nya/ios/1");
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
