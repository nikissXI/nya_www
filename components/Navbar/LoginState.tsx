"use client";

import { Button } from "../universal/button";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Center,
  Text,
  useDisclosure,
  Flex,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useAuth } from "../universal/AuthContext";
import { useState, useEffect } from "react";

export function LoginStateText() {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isLoggedIn, toggleLogin, wgnum, setWgnum, isLanding, toggleLanding } =
    useAuth();

  useEffect(() => {
    const key = localStorage.getItem("key"); // 替换为你的key名称
    if (key) {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL; // 从环境变量获取 API 地址
      // 如果有 key，发送请求验证有效性
      fetch(`${apiUrl}/checkKey`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${key}`,
        },
      })
        // .then((response) => response.json())
        .then((response) => {
          if (response.status === 401) {
            throw new Error("key无效");
          }
          return response.json();
        })
        .then((data) => {
          // 设置已登录状态
          setWgnum(data.wgnum);
          toggleLogin(true);
        })
        .catch((error) => {
          localStorage.removeItem("key");
          toggleLogin(false);
          console.error("验证key出错:", error);
        })
        .finally(() => {
          // console.log(loading);
        });
    } else {
      toggleLogin(false);
    }
    toggleLanding(false);
  }, [toggleLogin, setWgnum, toggleLanding]);

  const clickAction = () => {
    if (isLoggedIn) {
      toggleLogin(false);
      localStorage.removeItem("key");
    } else {
      router.push("/wgnum/bind");
    }
    onClose();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bgColor="#002f5c">
          <ModalHeader>
            {isLoggedIn ? "是要退出登录吗？" : "你还没有登录呢"}
          </ModalHeader>
          <ModalFooter>
            <Button bgColor="#007bc0" onClick={clickAction} mr={5}>
              {isLoggedIn ? "点击退出登录" : "前往登陆页面"}
            </Button>

            <Button bgColor="#ff5353" onClick={onClose}>
              关闭窗口
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Button
        position="fixed"
        top={3}
        left={{ md: 20, base: 2 }}
        variant="outline"
        colorScheme="whiteAlpha"
        rounded={10}
        onClick={onOpen}
        border={0}
        _hover={{ textDecoration: "none" }}
        _active={{ textDecoration: "none" }}
        bg="transparent"
      >
        <Center>
          <Text
            fontSize="lg"
            color="white"
            fontWeight="bold"
            hidden={isLanding}
          >
            {isLoggedIn ? `编号 ${wgnum}` : "未登录"}
          </Text>
        </Center>
      </Button>
    </>
  );
}
