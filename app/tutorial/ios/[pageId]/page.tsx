"use client";
import { Flex } from "@chakra-ui/react";

export default function Page({ params }: { params: { pageId: string } }) {
  const { pageId } = params;

  return (
    <Flex w="100%" h="100%">
      {pageId}
    </Flex>
  );
}
