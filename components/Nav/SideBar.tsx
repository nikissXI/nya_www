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
  Image,
  Icon,
} from "@chakra-ui/react";
import { useUserStateStore } from "@/store/user-state";
import { Link as RouterLink } from "react-router-dom";
import { ROOM_GAME_LIST, GENERAL_QQ_GROUP } from "@/utils/roomGames";
import { copyText } from "@/utils/strings";
import { MdContentCopy } from "react-icons/md";

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

export default function SideBar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isGameGroupOpen,
    onOpen: openGameGroup,
    onClose: closeGameGroup,
  } = useDisclosure();
  const { announcementsData } = useUserStateStore();

  return (
    <Box
      as="aside"
      maxW={{ base: "80%", md: "200px" }}
      flex={{ base: "none", md: "0 0 200px" }}
      mt={{ base: 6, md: 20 }}
      mb={{ base: "200px", md: 0 }}
      mx={{ base: "auto", md: 0 }}
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
          <Heading as="h3" fontSize="xl" color="#a8d1ff">
            喵服官方QQ群
          </Heading>

          <Box
            as="button"
            display="inline-flex"
            alignItems="center"
            gap={1}
            onClick={() => copyText(GENERAL_QQ_GROUP)}
            _hover={{ textDecoration: "none" }}
            fontWeight="bold"
          >
            {GENERAL_QQ_GROUP}
            <Icon as={MdContentCopy} boxSize={3.5} color="#7dd4ff" />
          </Box>

          <Link
            mt="1px"
            display="block"
            as="button"
            onClick={openGameGroup}
            _hover={{ textDecoration: "none" }}
            fontWeight="bold"
            color="#7dd4ff"
          >
            查看各游戏小群列表
          </Link>
        </Box>

        <Box w="100%">
          <Heading as="h3" fontSize="xl" color="#a8d1ff">
            赞助喵服
          </Heading>

          <Text whiteSpace="pre-wrap">觉得好用的话支持下啦</Text>
          <Link
            mt="1px"
            fontWeight="bold"
            as={RouterLink}
            to="/sponsor"
            color="#7dd4ff"
            _hover={{ textDecoration: "none" }}
          >
            查看赞助方式和特权
          </Link>
        </Box>

        <Box w="100%">
          <Heading as="h3" fontSize="xl" color="#a8d1ff">
            喵服公告
          </Heading>

          {announcementsData?.announcements && announcementsData.announcements.length > 0 ? (
            <>
              <Text fontWeight="bold" textAlign="left">
                {formatDate(announcementsData.announcements[0].timestamp, true)}
              </Text>

              <Text fontSize="sm" whiteSpace="pre-wrap" textAlign="left">
                {announcementsData.announcements[0].content}
              </Text>

              <Link
                mt="1px"
                fontWeight="bold"
                onClick={onOpen}
                color="#7dd4ff"
                _hover={{ textDecoration: "none" }}
              >
                查看历史公告
              </Link>
            </>
          ) : (
            <Text>暂无公告</Text>
          )}
        </Box>
      </Flex>

      <Modal
        isOpen={isGameGroupOpen}
        onClose={closeGameGroup}
        size="md"
        isCentered
      >
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
            <Heading as="h2" fontSize="lg" mb={4}>
              各游戏QQ群
            </Heading>
            <VStack align="stretch" spacing={2}>
              {ROOM_GAME_LIST.filter((game) => game.title !== "通用联机房").map(
                (game) => (
                  <Flex
                    key={game.path}
                    align="center"
                    justify="space-between"
                    gap={3}
                    pb={2}
                    borderBottom="1px solid"
                    borderColor="whiteAlpha.200"
                  >
                    <Flex>
                      <Image
                        mr={2}
                        src={game.icon}
                        alt={game.title}
                        boxSize="24px"
                        objectFit="cover"
                        borderRadius="md"
                        flexShrink={0}
                        bg="rgba(255,255,255,0.08)"
                      />
                      <Text>{game.title}</Text>
                    </Flex>
                    <Text
                      onClick={() => {
                        if (game.qq) copyText(game.qq);
                      }}
                      color={game.qq ? "white" : "gray.400"}
                    >
                      {game.qq ? game.qq : "暂无专属群"}
                      <Icon ml={1} as={MdContentCopy} boxSize={3} color="#7dd4ff" />
                    </Text>
                  </Flex>
                ),
              )}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>

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
              {announcementsData?.announcements &&
                announcementsData.announcements.map((item, index) => (
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
}
