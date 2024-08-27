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
import { Button } from "@/components/universal";

export default function OpenWarn() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isQQBrowser, setIsQQBrowser] = useState<boolean>(false);
  const [copyButtonText, setButtonText] =
    useState<string>("点击复制链接到剪切板");

  const [displayLink, setDisplayLink] = useState<boolean>(true);
  const currentUrl = window.location.href; // 获取当前网页链接

  useEffect(() => {
    const userAgent = navigator.userAgent;

    // 检查 User-Agent 是否包含 "QQ"
    if (userAgent.includes("QQ")) {
      // if (1) {
      setIsQQBrowser(true);
      onOpen(); // 打开模态窗口
    }
  }, [onOpen]);

  const handleCopyLink = () => {
    // if (window.isSecureContext) {  }
    try {
      navigator.clipboard.writeText(currentUrl);
      setButtonText("链接已复制到剪切板");
    } catch (err) {
      setButtonText("复制链接失败，请长按下方链接复制");
      setDisplayLink(false);
    }
  };

  const handleCloseClick = () => {
    onClose(); // 关闭模态窗口
  };

  return (
    <>
      {isQQBrowser && (
        <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
          <ModalOverlay />
          <ModalContent bgColor="#002f5c">
            <ModalHeader>不好意思打扰一下！</ModalHeader>
            <ModalBody>
              检测到您疑似在QQ内访问该网页，可能会导致下载安装包或文件异常，建议您点击下方按钮复制链接到浏览器粘贴访问，谢谢~
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
                  {currentUrl}
                </Text>
                <Button bgColor="#ff5353" onClick={handleCloseClick} mt={3}>
                  无视风险继续访问
                </Button>
              </Flex>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
}
