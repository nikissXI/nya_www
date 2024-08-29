"use client";

import React, { useEffect } from "react";
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
import { useRouter } from "next/navigation";
import { useAuth } from "../universal/AuthContext";

export default function VerifyWarnModal() {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) {
      onOpen();
    }
  }, [isLoggedIn, onOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent bgColor="#002f5c">
        <ModalHeader>警告</ModalHeader>
        <ModalBody>
          <Text>您尚未进行身份验证，将无法下载部分文件</Text>
        </ModalBody>
        <ModalFooter>
          <Flex direction="column" justify="center" align="center" width="100%">
            <Button
              bgColor="#007bc0"
              onClick={() => {
                router.push("/wgnum/bind");
              }}
            >
              前去验证身份
            </Button>

            <Button bgColor="#ff5353" onClick={onClose} mt={3}>
              无视风险继续访问
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
