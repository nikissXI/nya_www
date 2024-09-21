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
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useUserStateStore } from "@/store/user-state";
import { useEffect } from "react";

export function LoginStateText() {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { logging, logined, logout, userInfo, getUserInfo } =
    useUserStateStore();

  const clickAction = () => {
    if (logined) {
      logout();
    } else {
      router.push("/wgnum/bind");
    }
    onClose();
  };

  useEffect(() => {
    getUserInfo();
    console.log(userInfo);
  }, []);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bgColor="#002f5c">
          <ModalHeader>
            {logined ? "是要退出登录吗？" : "你还没有登录呢"}
          </ModalHeader>
          <ModalFooter>
            <Button bgColor="#007bc0" onClick={clickAction} mr={5}>
              {logined ? "点击退出登录" : "前往登陆页面"}
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
          <Text fontSize="lg" color="white" fontWeight="bold">
            {!logging && logined && userInfo ? userInfo.username : "未登录"}
          </Text>
        </Center>
      </Button>
    </>
  );
}
