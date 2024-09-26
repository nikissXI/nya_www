"use client";

import { Flex, IconButton, Stack, Text } from "@chakra-ui/react";
import { FaHome, FaUsers, FaUser } from "react-icons/fa";
import { useRouter } from "next/navigation";

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
      padding="0.5rem"
      display={{ md: "none", base: "flex" }}
    >
      <Stack spacing={0}>
        <IconButton
          aria-label="首页"
          icon={<FaHome />}
          variant="link"
          colorScheme="transparent"
          onClick={() => {
            router.push("/");
          }}
        />
        <Text fontSize="xs">喵服首页</Text>
      </Stack>

      <Stack spacing={0}>
        <IconButton
          aria-label="联机房间"
          icon={<FaUsers />}
          variant="link"
          colorScheme="transparent"
          onClick={() => {
            router.push("/room");
          }}
        />
        <Text fontSize="xs">联机房间</Text>
      </Stack>

      <Stack spacing={0}>
        <IconButton
          aria-label="我的信息"
          icon={<FaUser />}
          variant="link"
          colorScheme="transparent"
          onClick={() => {
            router.push("/me");
          }}
        />
        <Text fontSize="xs">我的信息</Text>
      </Stack>
    </Flex>
  );
}
