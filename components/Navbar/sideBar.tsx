import {
  Box,
  Flex,
  Text,
  Link,
  Heading,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  VStack,
  Divider,
} from "@chakra-ui/react";
import { useUserStateStore } from "@/store/user-state";
import { Link as RouterLink } from "react-router-dom";

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

const SideBar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { serverData } = useUserStateStore();

  return (
    <Box
      as="aside"
      maxW={{ base: "80%", md: "200px" }}
      flex={{ base: "none", md: "0 0 200px" }}
      mt={{ base: 6, md: 20 }}
      mb={{ base: "200px", md: 0 }}
      mx="auto"
    >
      <Flex
        px={{ base: "auto", md: 3 }}
        direction="column"
        position={{ base: "static", md: "sticky" }}
        top={{ base: 0, md: 24 }}
        gap={{ base: 3, md: 6 }}
        align={{ base: "center", md: "stretch" }}
        textAlign="left"
      >
        <Box w="100%">
          <Heading as="h3" fontSize={{ base: "md", md: "lg" }} color="#a8d1ff">
            喵服官方QQ群
          </Heading>
          <Link
            fontSize={{ base: "sm", md: "md" }}
            href="https://qm.qq.com/q/HxnUVAdRa8"
            target="_blank"
            _hover={{ textDecoration: "none" }}
            fontWeight="bold"
            letterSpacing="0.5px"
            display="inline-block"
            color="#7dd4ff"
          >
            1047464328
          </Link>
        </Box>

        <Box w="100%">
          <Heading as="h3" fontSize={{ base: "md", md: "lg" }} color="#a8d1ff">
            赞助喵服
          </Heading>
          <Text fontSize={{ base: "sm", md: "md" }} whiteSpace="pre-wrap">
            解锁专用节点创建房间权限及获得技术支持
          </Text>
          <Link
            fontSize={{ base: "sm", md: "md" }}
            fontWeight="bold"
            as={RouterLink}
            to="/sponsor"
            color="#7dd4ff"
            _hover={{ textDecoration: "none" }}
            display="inline-block"
          >
            了解赞助方式和特权
          </Link>
        </Box>

        <Box w="100%">
          <Heading as="h3" fontSize={{ base: "md", md: "lg" }} color="#a8d1ff">
            喵服公告
          </Heading>

          {serverData?.announcements && serverData.announcements.length > 0 ? (
            <>
              <Text
                fontSize={{ base: "sm", md: "md" }}
                fontWeight="bold"
                textAlign="left"
              >
                {formatDate(serverData.announcements[0].timestamp, true)}更新
              </Text>

              <Text
                fontSize={{ base: "sm", md: "sm" }}
                whiteSpace="pre-wrap"
                textAlign="left"
              >
                {serverData.announcements[0].content}
              </Text>

              <Text
                fontSize={{ base: "sm", md: "md" }}
                fontWeight="bold"
                color="#7dd4ff"
                onClick={onOpen}
                colorScheme="transparent"
              >
                查看历史公告
              </Text>
            </>
          ) : (
            <Text fontSize={{ base: "sm", md: "md" }}>暂无公告</Text>
          )}
        </Box>
      </Flex>

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

export default SideBar;
