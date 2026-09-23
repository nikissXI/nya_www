import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useUserStateStore } from "@/store/user-state";
import AuthForm from "./AuthForm";
import { MODAL_STYLE } from "./ui";

export default function LoginModal() {
  const navigate = useNavigate();
  const showLoginModal = useUserStateStore((s) => s.showLoginModal);
  const closeLoginModal = useUserStateStore((s) => s.closeLoginModal);

  return (
    <Modal isOpen={showLoginModal} onClose={closeLoginModal} isCentered>
      <ModalOverlay />
      <ModalContent {...MODAL_STYLE} maxW="340px">
        <ModalHeader textAlign="center">登录</ModalHeader>
        <ModalCloseButton />

        <ModalBody pb={5}>
          {/* 关闭时不渲染表单，避免每次进站都白拉一张验证码 */}
          {showLoginModal && (
            <AuthForm onSuccess={closeLoginModal} onLeave={closeLoginModal} />
          )}

          {/* 需要浏览器返回键 / 可分享链接时，可以改走独立登录页 */}
          <Text
            as="button"
            type="button"
            mt={4}
            w="100%"
            textAlign="center"
            fontSize="xs"
            color="rgba(255, 255, 255, 0.5)"
            _hover={{ color: "#7dd4ff" }}
            onClick={() => {
              closeLoginModal();
              navigate("/login");
            }}
          >
            在单独页面打开登录
          </Text>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
