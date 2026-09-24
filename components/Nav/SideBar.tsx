import { useState } from "react";
import {
  Box,
  Flex,
  Text,
  Link,
  Heading,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
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
import { copyText, formatAnnouncementDate } from "@/utils/strings";
import { MdContentCopy } from "react-icons/md";
import { INPUT_STYLE, MODAL_STYLE } from "@/components/universal/ui";
import { AnnouncementList } from "@/components/universal/Announcements";

export default function SideBar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isGameGroupOpen,
    onOpen: openGameGroup,
    onClose: closeGameGroup,
  } = useDisclosure();

  // 用 selector 单独订阅，避免 store 任意状态变化都触发侧栏重渲染
  const announcementsData = useUserStateStore((s) => s.announcementsData);

  // 各游戏群列表搜索
  const [gameSearchTerm, setGameSearchTerm] = useState("");

  const filteredGames = ROOM_GAME_LIST.filter(
    (game) =>
      game.title !== "通用联机房" &&
      game.title.toLowerCase().includes(gameSearchTerm.toLowerCase()),
  );

  /** 关闭群列表弹窗时顺带清空搜索 */
  const closeGameGroupAndReset = () => {
    closeGameGroup();
    setGameSearchTerm("");
  };

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
        px={{ md: 3 }}
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
            <Icon as={MdContentCopy} boxSize={3.5} color="#7ddcff" />
          </Box>

          <Link
            mt="1px"
            display="block"
            as="button"
            onClick={openGameGroup}
            _hover={{ textDecoration: "none" }}
            fontWeight="bold"
            color="#7ddcff"
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
            color="#7ddcff"
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
                {formatAnnouncementDate(
                  announcementsData.announcements[0].timestamp,
                  true,
                )}
              </Text>

              <Text fontSize="sm" whiteSpace="pre-wrap" textAlign="left">
                {announcementsData.announcements[0].content}
              </Text>

              <Link
                mt="1px"
                fontWeight="bold"
                onClick={onOpen}
                color="#7ddcff"
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
        onClose={closeGameGroupAndReset}
        size="md"
        isCentered
      >
        <ModalOverlay />
        <ModalContent {...MODAL_STYLE} maxH="80vh" overflowY="auto">
          <ModalHeader>各游戏QQ群</ModalHeader>
          <ModalCloseButton />

          <ModalBody pb={6}>
            <Input
              mb={3}
              placeholder="搜索游戏名称"
              value={gameSearchTerm}
              onChange={(e) => setGameSearchTerm(e.target.value)}
              {...INPUT_STYLE}
            />

            {filteredGames.length === 0 ? (
              <Text
                py={4}
                fontSize="sm"
                color="rgba(255, 255, 255, 0.6)"
                textAlign="center"
              >
                未找到相关游戏
              </Text>
            ) : (
              <VStack spacing={0} align="stretch">
                {filteredGames.map((game, index) => {
                  const qq = game.qq;

                  return (
                    <Box key={game.path}>
                      {index > 0 && (
                        <Divider borderColor="rgba(255, 255, 255, 0.1)" />
                      )}

                      <Flex
                        align="center"
                        justify="space-between"
                        gap={3}
                        py={2}
                      >
                        <Flex align="center" minW={0}>
                          <Image
                            mr={2}
                            src={game.icon}
                            alt={game.title}
                            boxSize="28px"
                            objectFit="cover"
                            borderRadius="md"
                            flexShrink={0}
                            bg="rgba(255,255,255,0.08)"
                          />

                          <Text isTruncated>{game.title}</Text>
                        </Flex>

                        {/* 无专属群的只给灰字，不再渲染可点却没反应的复制图标 */}
                        {qq ? (
                          <Flex
                            as="button"
                            type="button"
                            align="center"
                            gap={1}
                            flexShrink={0}
                            fontSize="sm"
                            color="white"
                            onClick={() => copyText(qq)}
                            _hover={{ color: "#7ddcff" }}
                          >
                            {qq}
                            <Icon
                              as={MdContentCopy}
                              boxSize={3.5}
                              color="#7ddcff"
                            />
                          </Flex>
                        ) : (
                          <Text flexShrink={0} fontSize="sm" color="gray.400">
                            暂无专属群
                          </Text>
                        )}
                      </Flex>
                    </Box>
                  );
                })}
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
        <ModalOverlay />
        <ModalContent {...MODAL_STYLE} maxH="80vh" overflowY="auto">
          <ModalHeader>历史公告</ModalHeader>
          <ModalCloseButton />

          <ModalBody pb={6}>
            <AnnouncementList />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
