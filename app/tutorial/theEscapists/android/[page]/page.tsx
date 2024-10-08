"use client";

import { Flex, Box, Center } from "@chakra-ui/react";
import { Button } from "@/components/universal/button";
import { Page as Page1 } from "@/components/tutorial/theEscapists/android/Page1";
import { Page as Page2 } from "@/components/tutorial/theEscapists/android/Page2";
import { useRouter } from "next/navigation";

export default function Page({ params }: { params: { page: number } }) {
  const { page } = params;
  const pageId = Number(page);

  const router = useRouter();

  const pageMap: { [key: number]: JSX.Element } = {
    1: <Page1 />,
    2: <Page2 />,
  };

  const pageCount = Object.keys(pageMap).length;

  return (
    <Flex
      direction="column"
      justifyContent="space-between"
      alignItems="center"
      mx="5vw"
      minH="50vh"
    >
      {pageMap[pageId]}

      <Flex justifyContent="space-between" direction="column" mb={6}>
        <Center mt={6} mb={2}>
          教程进度 {pageId}/{pageCount}
        </Center>
        <Flex>
          <Box width="100%">
            <Button
              bgColor="#e87f2c"
              visibility={pageId > 1 ? "visible" : "hidden"}
              onClick={() => {
                router.push(`${pageId - 1}`);
              }}
            >
              上一步
            </Button>
          </Box>

          <Box width="100%" mx={5}>
            <Button
              bgColor="#b23333"
              onClick={() => {
                router.push(`/tutorial/theEscapists`);
              }}
            >
              返回
            </Button>
          </Box>

          <Box width="100%">
            <Button
              bgColor="#30ad2a"
              visibility={pageId < pageCount ? "visible" : "hidden"}
              onClick={() => {
                router.push(`${pageId + 1}`);
              }}
            >
              下一步
            </Button>
          </Box>
        </Flex>
      </Flex>
    </Flex>
  );
}
