"use client";

import { Flex, Stack, Text } from "@chakra-ui/react";
import { FaHome, FaUsers, FaUser } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { Button } from "../universal/button";
import { useState, useEffect, useCallback } from "react";

export default function Footer({ path }: { path: string }) {
  const router = useRouter();
  // const rootPath = "/" + path.split("/")[1];

  const [activeButton, setActiveButton] = useState<string>("");

  const handleButtonClick = useCallback(
    (path: string) => {
      router.push(path);
      setActiveButton(path);
    },
    [router]
  );

  useEffect(() => {
    setActiveButton(path);
  }, [path]);

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
      zIndex={100}
    >
      <Button
        padding="1rem"
        variant="link"
        bg="transparent"
        colorScheme="transparent"
        color={activeButton === "/" ? "#47cdff" : "white"}
        onClick={() => handleButtonClick("/")}
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
        color={activeButton === "/room" ? "#47cdff" : "white"}
        onClick={() => handleButtonClick("/room")}
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
        color={activeButton === "/me" ? "#47cdff" : "white"}
        onClick={() => handleButtonClick("/me")}
      >
        <Stack spacing={0} align="center">
          <FaUser />
          <Text fontSize="xs">我的信息</Text>
        </Stack>
      </Button>
    </Flex>
  );
}
