"use client";

import { Flex, Stack, Text } from "@chakra-ui/react";
import { FaHome, FaUsers, FaUser } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { Button } from "../universal/button";
import { useState } from "react";

export default function Footer() {
  const router = useRouter();

  const [activeButton, setActiveButton] = useState<string>("");

  const handleButtonClick = (path: string, buttonName: string) => {
    router.push(path);
    setActiveButton(buttonName);
  };

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
        color={activeButton === "home" ? "#47cdff" : "white"}
        onClick={() => handleButtonClick("/", "home")}
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
        color={activeButton === "room" ? "#47cdff" : "white"}
        onClick={() => handleButtonClick("/room", "room")}
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
        color={activeButton === "me" ? "#47cdff" : "white"}
        onClick={() => handleButtonClick("/me", "me")}
      >
        <Stack spacing={0} align="center">
          <FaUser />
          <Text fontSize="xs">我的信息</Text>
        </Stack>
      </Button>
    </Flex>
  );
}
