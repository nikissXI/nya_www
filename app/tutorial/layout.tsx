"use client";

import { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Flex,
  Text,
} from "@chakra-ui/react";
import { Button } from "@/components/universal/button";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isQQBrowser, setIsQQBrowser] = useState<boolean>(false);
  const [copyButtonText, setButtonText] =
    useState<string>("点击复制链接到剪切板");

  const [displayLink, setDisplayLink] = useState<boolean>(true);

  useEffect(() => {
    const userAgent = navigator.userAgent;
    // 检查 User-Agent 是否包含 "QQ"
    if (userAgent.includes("QQ/")) {
      setIsQQBrowser(true);
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
    <>
      {isQQBrowser && (
        <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
          <ModalOverlay />
          <ModalContent bgColor="#002f5c">
            <ModalHeader>不好意思打扰一下！</ModalHeader>
            <ModalBody>
              检测到您疑似在QQ内访问该网页，会导致下载功能异常，建议您点击下方按钮复制链接到浏览器粘贴访问，谢谢~
            </ModalBody>
            <ModalFooter>
              <Flex
                direction="column"
                justify="center"
                align="center"
                width="100%"
              >
                <Button bgColor="#007bc0" onClick={handleCopyLink}>
                  {copyButtonText}
                </Button>
                <Text hidden={displayLink} fontSize="lg" my={3}>
                  {window.location.href}
                </Text>
                <Button bgColor="#ff5353" onClick={onClose} mt={3}>
                  无视风险继续访问
                </Button>
              </Flex>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
      {children}
    </>
  );
}
