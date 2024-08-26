"use client";

import { Flex, Text, Box, Button, Heading } from "@chakra-ui/react";
import AndroidPage1 from "@/components/tutorial/android/page1";
import { useRouter } from "next/navigation";
export default function Page({ params }: { params: { pageId: string } }) {
  const { pageId } = params;
  const router = useRouter();

  const pageMap: { [key: string]: JSX.Element } = {
    "0": <AndroidPage1 />,
  };

  const currentStepIndex = 1;
  return (
    <Flex
      direction="column"
      justifyContent="space-between"
      alignItems="center"
      mx="6vw"
    >
      <Heading mb={4}>安卓教程</Heading>

      {pageMap[pageId]}

      <Flex justifyContent="space-between" mt={6}>
        <Box width="100%">
          <Button
            bgColor="#e87f2c"
            visibility={currentStepIndex > 1 ? "visible" : "hidden"}
          >
            上一步
          </Button>
        </Box>

        <Box width="100%" mx="5vw">
          <Button
            bgColor="#b23333"
            onClick={() => {
              router.push("/tutorial"); // 匿名函数路由到 /wgnum
            }}
          >
            返回
          </Button>
        </Box>

        <Box width="100%">
          <Button
            bgColor="#30ad2a"
            visibility={currentStepIndex < 10 ? "visible" : "hidden"}
          >
            下一步
          </Button>
        </Box>
      </Flex>
    </Flex>
  );
}
