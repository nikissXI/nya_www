import { useEffect, useState } from "react";
import {
  Box,
  Divider,
  Flex,
  Heading,
  Icon,
  Image,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import {
  MdCampaign,
  MdContentCopy,
  MdFavorite,
  MdGroups,
} from "react-icons/md";
import { useUserStateStore } from "@/store/user-state";
import { GENERAL_QQ_GROUP, ROOM_GAME_LIST } from "@/utils/roomGames";
import { copyText, formatAnnouncementDate } from "@/utils/strings";
import { AnnouncementList } from "@/components/universal/Announcements";
import { Card, EmptyState, INPUT_STYLE, MODAL_STYLE } from "@/components/universal/ui";

/**
 * 全站右侧信息栏
 * ------------------------------------------------------------------
 * 桌面端（lg 起）是 sticky 右栏；移动端顺着内容流堆在页面底部，
 * 两处共用同一份结构，只改宽度和定位，不重复渲染两份内容。
 */
export default function SideBar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isGameGroupOpen,
    onOpen: openGameGroup,
    onClose: closeGameGroup,
  } = useDisclosure();

  // 带 ?groups 访问时（方便把「各游戏小群列表」当分享链接用），加载完自动弹出弹窗
  const { search } = useLocation();
  const shouldOpenGameGroups = new URLSearchParams(search).has("groups");

  useEffect(() => {
    if (shouldOpenGameGroups) openGameGroup();
  }, [shouldOpenGameGroups, openGameGroup]);

  // 用 selector 单独订阅，避免 store 任意状态变化都触发侧栏重渲染
  const announcementsData = useUserStateStore((s) => s.announcementsData);

  const [gameSearchTerm, setGameSearchTerm] = useState("");

  const filteredGames = ROOM_GAME_LIST.filter(
    (game) =>
      game.title !== "通用联机房" &&
      game.title.toLowerCase().includes(gameSearchTerm.toLowerCase()),
  );

  const latestAnnouncement = announcementsData?.announcements?.[0];

  /** 关闭群列表弹窗时顺带清空搜索 */
  const closeGameGroupAndReset = () => {
    closeGameGroup();
    setGameSearchTerm("");
  };

  return (
    <Box
      as="aside"
      w={{ base: "100%", lg: "300px" }}
      flexShrink={0}
      position={{ base: "static", lg: "sticky" }}
      top={{ lg: "88px" }}
      mt={{ base: 8, lg: 0 }}
    >
      <VStack align="stretch" spacing={4}>
        {/* ---------- 公告 ---------- */}
        <Card p={4}>
          <SectionHead
            icon={MdCampaign}
            title="喵服公告"
          />

          {latestAnnouncement ? (
            <>
              <Text
                className="tabular"
                fontSize="xs"
                color="text.faint"
                fontWeight="600"
                mb={1}
              >
                {formatAnnouncementDate(latestAnnouncement.timestamp, true)}
              </Text>

              <Text
                fontSize="sm"
                color="text.muted"
                whiteSpace="pre-wrap"
                lineHeight="1.7"
                noOfLines={6}
              >
                {latestAnnouncement.content}
              </Text>

              <Link
                as="button"
                type="button"
                mt={2}
                fontSize="sm"
                color="brand.text"
                _hover={{ textDecoration: "underline" }}
                onClick={onOpen}
              >
                查看历史公告
              </Link>
            </>
          ) : (
            <Text fontSize="sm" color="text.faint">
              暂无公告
            </Text>
          )}
        </Card>

        {/* ---------- QQ 群 ---------- */}
        <Card p={4}>
          <SectionHead icon={MdGroups} title="官方 QQ 群" />

          <Flex align="center" gap={2}>
            <Text fontSize="sm" color="text.muted">
              大群
            </Text>

            <Flex
              as="button"
              type="button"
              align="center"
              gap={1}
              fontWeight="700"
              fontSize="sm"
              color="text.main"
              onClick={() => copyText(GENERAL_QQ_GROUP)}
              _hover={{ color: "brand.text" }}
              title="点击复制"
            >
              {GENERAL_QQ_GROUP}
              <Icon as={MdContentCopy} boxSize={3.5} color="brand.text" />
            </Flex>
          </Flex>

          <Link
            as="button"
            type="button"
            mt={2}
            fontSize="sm"
            textAlign="left"
            color="brand.text"
            _hover={{ textDecoration: "underline" }}
            onClick={openGameGroup}
          >
            查看各游戏小群列表
          </Link>
        </Card>

        {/* ---------- 赞助 ---------- */}
        <Card p={4}>
          <SectionHead icon={MdFavorite} title="赞助喵服" />

          <Text fontSize="sm" color="text.muted" lineHeight="1.7">
            觉得好用的话支持下啦，赞助可以解锁专属节点与特权。
          </Text>

          <Link
            as={RouterLink}
            to="/sponsor"
            mt={2}
            fontSize="sm"
            color="brand.text"
            _hover={{ textDecoration: "underline" }}
          >
            查看赞助方式
          </Link>
        </Card>
      </VStack>

      {/* ---------- 各游戏 QQ 群 ---------- */}
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
              <EmptyState title="未找到相关游戏" />
            ) : (
              <VStack spacing={0} align="stretch">
                {filteredGames.map((game, index) => {
                  const qq = game.qq;

                  return (
                    <Box key={game.path}>
                      {index > 0 && <Divider />}

                      <Flex align="center" justify="space-between" gap={3} py={2}>
                        <Flex align="center" minW={0}>
                          <Image
                            mr={2}
                            src={game.icon}
                            alt={game.title}
                            boxSize="28px"
                            objectFit="cover"
                            borderRadius="md"
                            flexShrink={0}
                            bg="bg.subtle"
                          />

                          <Text isTruncated fontSize="sm">
                            {game.title}
                          </Text>
                        </Flex>

                        {/* 无专属群的只给灰字，不渲染可点却没反应的复制图标 */}
                        {qq ? (
                          <Flex
                            as="button"
                            type="button"
                            align="center"
                            gap={1}
                            flexShrink={0}
                            fontSize="sm"
                            color="text.main"
                            onClick={() => copyText(qq)}
                            _hover={{ color: "brand.text" }}
                            title="点击复制"
                          >
                            {qq}
                            <Icon
                              as={MdContentCopy}
                              boxSize={3.5}
                              color="brand.text"
                            />
                          </Flex>
                        ) : (
                          <Text flexShrink={0} fontSize="sm" color="text.faint">
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

      {/* ---------- 历史公告 ---------- */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
        <ModalOverlay />
        <ModalContent {...MODAL_STYLE} maxH="80vh">
          <ModalHeader>历史公告</ModalHeader>
          <ModalCloseButton />

          <ModalBody pb={6} overflowY="auto">
            <AnnouncementList />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}

/** 侧栏小节标题：图标 + 标题 + 右侧操作 */
function SectionHead({
  icon,
  title,
  action,
}: {
  icon: React.ComponentType;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <Flex align="center" justify="space-between" gap={2} mb={2}>
      <Flex align="center" gap={2} minW={0}>
        <Flex
          align="center"
          justify="center"
          boxSize="26px"
          rounded="lg"
          bg="brand.soft"
          color="brand.text"
          flexShrink={0}
        >
          <Icon as={icon} boxSize={4} />
        </Flex>

        <Heading as="h3" fontSize="sm" fontWeight="700" isTruncated>
          {title}
        </Heading>
      </Flex>

      {action}
    </Flex>
  );
}
