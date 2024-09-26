"use client";

import { Flex, Stack, Text } from "@chakra-ui/react";
import { FaHome, FaUsers, FaUser } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { Button } from "../universal/button";

export default function Footer() {
  const router = useRouter();

  return (
    <Flex
      as="nav"
      bg="#1b1e25"
      color="white"
      position="fixed"
      bottom="0"
      left="0"
      right="0"
      justifyContent="space-around"
      display={{ md: "none", base: "flex" }}
    >
      <Button
        padding="1rem"
        variant="link"
        bg="transparent"
        colorScheme="transparent"
        onClick={() => {
          router.push("/");
        }}
      >
        <Stack spacing={0} align="center">
          <FaHome />
          <Text fontSize="xs">喵服首页</Text>
        </Stack>
      </Button>

      <Button
        padding="1rem"
        variant="link"
        bg="transparent"
        colorScheme="transparent"
        onClick={() => {
          router.push("/room");
        }}
      >
        <Stack spacing={0} align="center">
          <FaUsers />
          <Text fontSize="xs">联机房间</Text>
        </Stack>
      </Button>

      <Button
        padding="1rem"
        variant="link"
        bg="transparent"
        colorScheme="transparent"
        onClick={() => {
          router.push("/me");
        }}
      >
        <Stack spacing={0} align="center">
          <FaUser />
          <Text fontSize="xs">我的信息</Text>
        </Stack>
      </Button>
    </Flex>
  );
}
