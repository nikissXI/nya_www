import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  Text,
  Link,
  Flex,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useUserStateStore } from "@/store/user-state";
import { useRouter } from "next/navigation";

const TunnelUpdateModal = () => {
  const router = useRouter();

  const [countdown, setCountdown] = useState(5);
  const [canClose, setCanClose] = useState(false);
  const { showRegetModal, setShowRegetModal } = useUserStateStore();

  useEffect(() => {
    if (showRegetModal) {
      setCanClose(false);
      setCountdown(5);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setCanClose(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [showRegetModal]);

  return (
    <Modal
      isOpen={showRegetModal}
      onClose={setShowRegetModal}
      closeOnOverlayClick={false}
      isCentered
    >
      <ModalOverlay />
      <ModalContent bgColor="#002f5c">
        <ModalHeader alignSelf="center">请更新WG隧道文件</ModalHeader>
        <ModalBody>
          <Text>获取了新编号后，原编号的WG隧道文件就会失效废弃</Text>
          <Text>你需要下载并导入新编号的隧道才能正常连接喵服</Text>
          <Text>到WG部署教程页面中，再操作一次“导入隧道”部分即可</Text>

          <Text textAlign="center" mt={4}>
            {!canClose && `还有 ${countdown} 秒可以跳转`}
          </Text>

          <Button
            my={4}
            w="100%"
            onClick={() => {
              router.push("/tutorial");
              setShowRegetModal();
            }}
            isDisabled={!canClose}
          >
            点击跳转WG部署教程
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default TunnelUpdateModal;
