import React from "react";
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

const NeedSponsorModal = () => {
  const router = useRouter();

  const { showSponsorModal, setShowSponsorModal } = useUserStateStore();

  return (
    <Modal isOpen={showSponsorModal} onClose={setShowSponsorModal} isCentered>
      <ModalOverlay />
      <ModalContent bgColor="#002f5c">
        <ModalHeader alignSelf="center">怕你不知道能赞助提醒一下</ModalHeader>
        <ModalBody>
          <Text>觉得好用可以根据自己经济能力赞助哈~</Text>
          <Text>联机页面和我的信息页面的左侧有赞助跳转图标</Text>

          <Button
            my={2}
            w="100%"
            onClick={() => {
              router.push("/sponsor");
              setShowSponsorModal();
            }}
          >
            点击跳转赞助页面
          </Button>
          <Button
            my={2}
            w="100%"
            onClick={() => {
              setShowSponsorModal();
            }}
          >
            关闭弹窗
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default NeedSponsorModal;
