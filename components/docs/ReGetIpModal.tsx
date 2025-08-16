import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  Text,
} from "@chakra-ui/react";
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
      setCountdown(10);
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
          <Text>你获取了新ip，旧ip及其隧道已失效</Text>
          <Text>需要下载并导入新隧道才能正常连接喵服</Text>
          <Text>到使用教程页面，再操作一次“WG下载和隧道导入”即可</Text>

          <Text textAlign="center" mt={4}>
            {!canClose && `还有 ${countdown} 秒可以跳转`}
          </Text>

          <Button
            my={4}
            w="100%"
            onClick={() => {
              router.push("/docs#download");
              setShowRegetModal();
            }}
            isDisabled={!canClose}
          >
            点击跳转使用教程页面
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default TunnelUpdateModal;
