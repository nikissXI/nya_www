"use client";

import { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  Text,
  useDisclosure,
  Flex,
} from "@chakra-ui/react";
import { useUserStateStore } from "@/store/user-state";
import { useDisclosureStore } from "@/store/disclosure";

export function VerifyWarnModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { logined } = useUserStateStore();
  const { onToggle: loginToggle } = useDisclosureStore((state) => {
    return state.modifyLoginDisclosure;
  });
  useEffect(() => {
    if (!logined) {
      onOpen();
    }
  }, [logined, onOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent bgColor="#002f5c">
        <ModalHeader>警告</ModalHeader>
        <ModalBody>
          <Text>你还没登陆，将无法下载WG配置文件</Text>
        </ModalBody>
        <ModalFooter>
          <Flex direction="column" justify="center" align="center" width="100%">
            <Button onClick={loginToggle}>点击登录</Button>

            <Button onClick={onClose} mt={3}>
              我已知晓
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export function IsQQBrowserWarnModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [copyButtonText, setButtonText] =
    useState<string>("点击复制链接到剪切板");

  const [displayLink, setDisplayLink] = useState<boolean>(true);

  useEffect(() => {
    const userAgent = navigator.userAgent;
    // 检查 User-Agent 是否包含 "QQ"
    if (userAgent.includes("QQ/")) {
      onOpen();
    }
  }, [onOpen]);

  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setButtonText("链接已复制到剪切板");
    } catch (err) {
      alert(err);
      setButtonText("复制链接失败，请长按下方链接复制");
      setDisplayLink(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent bgColor="#002f5c">
        <ModalHeader>警告</ModalHeader>

        <ModalBody>
          检测到您疑似在QQ内访问，会导致下载功能异常，请点击下方按钮复制链接到浏览器粘贴访问
          <br />
          如果误报请联系服主，谢谢~
        </ModalBody>
        <ModalFooter>
          <Flex direction="column" justify="center" align="center" width="100%">
            <Button onClick={handleCopyLink}>{copyButtonText}</Button>
            <Text hidden={displayLink} fontSize="lg" my={3}>
              {window.location.href}
            </Text>
            <Button onClick={onClose} mt={3}>
              我就看看不下载
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}