import NextLink from "next/link";
import {
  Box,
  Button,
  Flex,
  Text,
  Link,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  Spinner,
  VStack,
  HStack,
  Divider,
} from "@chakra-ui/react";
import { useUserStateStore } from "@/store/user-state";

const formatDate = (rawTs: number, short: boolean = false): string => {
  // 支持秒或毫秒
  const ts = rawTs < 1e12 ? rawTs * 1000 : rawTs;
  const d = new Date(ts);

  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const date = d.getDate();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");

  if (short) return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
  else return `${year}年${month}月${date}日 ${hours}:${minutes}`;
};

export const AnnouncementsModal = ({}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { serverData } = useUserStateStore();

  return (
    <Box textAlign="center">
      <Box mx={5} mb={3} fontWeight="bold">
        {/* <Text color="#ffca3d" size="sm">
          新增上海D节点，别挤在上海B和C啦
        </Text> */}

        <Flex justify="center" align="center" wrap="wrap">
          {serverData === undefined ? (
            <HStack spacing={2}>
              <Spinner size="xs" />
              <Text>正在加载公告...</Text>
            </HStack>
          ) : serverData.announcements &&
            serverData.announcements.length > 0 ? (
            <Text noOfLines={1}>
              公告更新时间{" "}
              {formatDate(serverData.announcements[0].timestamp, true)}
            </Text>
          ) : (
            <Text>暂无公告</Text>
          )}

          {serverData?.announcements &&
            serverData?.announcements.length > 0 && (
              <Button
                ml={1}
                color="#7dd4ff"
                onClick={onOpen}
                colorScheme="transparent"
                variant="link"
                _hover={{ textDecoration: "none" }}
              >
                点击查看
              </Button>
            )}
        </Flex>

        <Text>
          赞助10元可加服主一对一教学
          <Link
            ml={1}
            as={NextLink}
            href="/sponsor"
            color="#7dd4ff"
            _hover={{ textDecoration: "none" }}
          >
            点击赞助
          </Link>
        </Text>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
        <ModalOverlay />
        <ModalContent
          bg="#202e4fe0"
          color="white"
          maxH="70%"
          overflowY="auto"
          mx={5}
          py={5}
        >
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={2}>
              {serverData?.announcements &&
                serverData.announcements.map((item, index) => (
                  <Box key={index} p={1} w="100%">
                    <Text mb={1} fontWeight="bold" color="#f4d106">
                      {formatDate(item.timestamp)}
                    </Text>
                    <Divider mb={2} />
                    <Text whiteSpace="pre-wrap">{item.content}</Text>
                  </Box>
                ))}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AnnouncementsModal;
