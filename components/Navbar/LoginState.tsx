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
  const { isLoggedIn, toggleLogin, wgnum, setWgnum } = useAuth();

  useEffect(() => {
    const key = localStorage.getItem("key"); // 替换为你的key名称
    if (key) {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL; // 从环境变量获取 API 地址
      // 如果有 key，发送请求验证有效性
      fetch(`${apiUrl}/checkKey?key=${key}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.code === 1) {
            // code 为 1，移除 key
            localStorage.removeItem("key");
            toggleLogin(false);
          } else if (data.code === 0) {
            // code 为 0，设置已登录状态
            setWgnum(data.wgnum);
            toggleLogin(true);
          }
        })
        .catch((error) => {
          console.error("Error fetching the key:", error);
        });
    } else {
      toggleLogin(false);
    }
  }, [isLoggedIn, toggleLogin, setWgnum]);

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
        mx={{ base: 6, md: "none" }}
        my={3}
        py={2}
        _hover={{ textDecoration: "none" }}
        _active={{ textDecoration: "none" }}
        bg="transparent"
        rounded={12}
        onClick={onOpen}
      >
        <Center>
          <Text color="white" fontWeight="bold">
            {isLoggedIn ? `已登录(${wgnum})` : "未登录"}
          </Text>
        </Center>
      </Button>
    </>
  );
}
