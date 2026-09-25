import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import {
  Box,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalOverlay,
  Heading,
  HStack,
  VStack,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Flex,
  Tag,
  Icon,
  Badge,
  Image,
  Center,
  Spinner,
  Divider,
  Collapse,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { openToast } from "@/components/universal/toast";
import { Button } from "@/components/universal/button";
import { TbReload } from "react-icons/tb";
import { MdContentCopy, MdSearch, MdInfoOutline } from "react-icons/md";
import { useUserStateStore } from "@/store/user-state";
import {
  copyText,
  getErrorMessage,
  getNetColor,
  getNetText,
  isInteger,
  getStatusColor,
  getDelayIcon,
  getDelayColor,
} from "@/utils/strings";
import { RiSignalCellularOffLine } from "react-icons/ri";
import { IoIosExit } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { NoticeText } from "@/components/universal/Notice";
import SponsorTag from "@/components/universal/SponsorTag";
import { shouldSilenceError, type ApiEnvelope } from "@/utils/api";
import { api } from "@/utils/endpoints";
import TheEscapistsTool from "@/components/universal/theEscapistsTool";
import {
  ROOM_GAME_LIST,
  getRoomGameName,
  type GameRoomItem,
} from "@/utils/roomGames";
import {
  CARD_PADDING,
  CARD_STYLE,
  INPUT_STYLE,
  MODAL_STYLE,
  SectionTitle,
} from "@/components/universal/ui";
import { AnnouncementCarousel } from "@/components/universal/Announcements";

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

/** 房间角色常量 */
const ROLE_HOSTER = "hoster";
const ROLE_NONE = "none";

// 游戏房间配置、群号、房间角色常量已迁移到 @/utils/roomGames
// （放在独立模块可避免该页面被静态引用，保证路由懒加载生效）

export default function Page() {
  const navigate = useNavigate();

  // 使用 useRef 作为并发请求锁，解决 useState 异步更新导致的竞态问题
  const isRequesting = useRef(false);

  const {
    isOpen: setPassIsOpen,
    onOpen: setPassOnOpen,
    onClose: setPassOnClose,
  } = useDisclosure();
  const {
    isOpen: isSponsorNoticeOpen,
    onOpen: openSponsorNotice,
    onClose: closeSponsorNotice,
  } = useDisclosure();

  const [hideJoinPassInput, setHideJoinPassInput] = useState(true);

  const [inputRoomId, setInputRoomId] = useState("");
  const [inputPasswd, setInputPasswd] = useState("");
  const [gameSearchTerm, setGameSearchTerm] = useState("");
  const [selectedGame, setSelectedGame] = useState<GameRoomItem | null>(null);
  const [gameInfo, setGameInfo] = useState<GameRoomItem | null>(null);
  const [sponsorNotice, setSponsorNotice] = useState("");
  // 用 selector 单独订阅，避免 store 任意状态变化都触发本页重渲染
  const userInfo = useUserStateStore((s) => s.userInfo);
  const userWgInfo = useUserStateStore((s) => s.userWgInfo);
  const roomData = useUserStateStore((s) => s.roomData);
  const roomRole = useUserStateStore((s) => s.roomRole);
  const latency = useUserStateStore((s) => s.latency);
  const isOnline = useUserStateStore((s) => s.isOnline);
  const rotate = useUserStateStore((s) => s.rotate);
  const disableFlush = useUserStateStore((s) => s.disableFlush);
  const nodeNetLoad = useUserStateStore((s) => s.nodeNetLoad);
  const getRoomData = useUserStateStore((s) => s.getRoomData);
  const setRoomPassword = useUserStateStore((s) => s.setRoomPassword);
  const openLoginModal = useUserStateStore((s) => s.openLoginModal);
  const setNodeListModal = useUserStateStore((s) => s.setNodeListModal);

  useEffect(() => {
    // 当节点存在，且还没有房间数据时，自动拉取
    if (userWgInfo?.node_alias && roomData === undefined) {
      getRoomData();
    }
  }, [userWgInfo?.node_alias, roomData, getRoomData]);

  // 房间操作统一入口：加并发锁；创建/加入/关闭/退出房间时成功后回到页面顶部
  const runRoomAction = useCallback(
    async (
      action: () => Promise<ApiEnvelope<unknown>>,
      options: { scrollTop?: boolean } = {},
    ): Promise<ApiEnvelope<unknown>> => {
      if (isRequesting.current) {
        throw new Error("请不要点太快");
      }
      isRequesting.current = true;

      try {
        // code === -1（数据异常刷新页面）由请求层统一处理
        const payload = await action();

        // 只有会切换房间状态的操作用户才会“换页”，设密码/踢人不需要滚顶
        if (options.scrollTop && payload.code === 0) window.scrollTo(0, 0);

        return payload;
      } finally {
        isRequesting.current = false;
      }
    },
    [], // 无依赖，保持完全稳定
  );

  // 统一的请求异常提示
  const showRequestError = useCallback((err: unknown, prefix = "") => {
    // 凭证失效（已统一登出）/ 数据异常（已刷新页面）不再重复提示
    if (shouldSilenceError(err)) return;

    openToast({
      content: `${prefix}${getErrorMessage(err)}`,
      status: "error",
    });
  }, []);

  // 设置房间密码
  const handleSetRoomPasswd = useCallback(
    async (newPasswd: string) => {
      try {
        const data = await runRoomAction(() => api.setRoomPasswd(newPasswd));

        if (data.code === 0) {
          if (roomData) {
            setRoomPassword(newPasswd);
          }
          openToast({ content: data.msg ?? "密码设置成功", status: "success" });
          setPassOnClose();
        } else {
          openToast({ content: data.msg ?? "密码设置失败", status: "warning" });
        }
      } catch (err) {
        showRequestError(err);
      }
    },
    [
      runRoomAction,
      roomData,
      setRoomPassword,
      setPassOnClose,
      showRequestError,
    ],
  );

  // 创建房间
  const handleCreateRoom = useCallback(
    async (game?: GameRoomItem) => {
      try {
        const data = await runRoomAction(
          () =>
            api.roomAction({
              handleType: "createRoom",
              value: getRoomGameName(game),
            }),
          { scrollTop: true },
        );
        if (data.code === 0) {
          setSelectedGame(game ?? null);
          getRoomData();
        } else {
          if (data.msg?.includes("赞助")) {
            setSponsorNotice(data.msg ?? "");
            openSponsorNotice();
            return;
          }

          if (isOnline && data.msg?.includes("再创建")) {
            getRoomData();
          }
          openToast({ content: data.msg ?? "创建房间失败", status: "warning" });
        }
      } catch (err) {
        showRequestError(err);
      }
    },
    [runRoomAction, getRoomData, isOnline, openSponsorNotice, showRequestError],
  );

  // 关闭房间（房主）/ 退出房间（成员）：两个操作只有 handleType 不同
  const handleLeaveRoom = useCallback(
    async (handleType: "closeRoom" | "exitRoom") => {
      try {
        const data = await runRoomAction(
          () => api.roomAction({ handleType, value: "" }),
          { scrollTop: true },
        );
        if (data.code === 0) {
          setSelectedGame(null);
          getRoomData();
        } else {
          openToast({ content: data.msg ?? "操作失败", status: "error" });
        }
      } catch (err) {
        showRequestError(err, "请求出错：");
      }
    },
    [runRoomAction, getRoomData, showRequestError],
  );

  // 加入房间
  const handleJoinRoom = useCallback(
    async (roomId: string, passwd: string) => {
      if (!roomId) return;

      if (!isInteger(roomId)) {
        openToast({
          content: "房间号是串数字，不知道就问房主",
          status: "warning",
        });
        return;
      }

      try {
        const data = await runRoomAction(
          () =>
            api.roomAction({
              handleType: "joinRoom",
              value: roomId,
              roomPasswd: passwd,
            }),
          { scrollTop: true },
        );

        if (data.code === 0) {
          setSelectedGame(null);
          getRoomData();
          setHideJoinPassInput(true);
          setInputRoomId("");
          setInputPasswd("");
        } else {
          if (data.msg?.includes("密码")) {
            setHideJoinPassInput(false);
          }
          if (isOnline && data.msg?.includes("再加入")) {
            getRoomData();
          }
          openToast({ content: data.msg ?? "加入房间失败", status: "warning" });
        }
      } catch (err) {
        showRequestError(err, "请求出错：");
      }
    },
    [runRoomAction, getRoomData, isOnline, showRequestError],
  );

  // 踢出成员
  const handleDelMember = useCallback(
    async (delIp: string) => {
      try {
        const data = await runRoomAction(() =>
          api.roomAction({ handleType: "delMember", value: delIp }),
        );
        if (data.code === 0) {
          getRoomData();
        } else {
          openToast({ content: data.msg ?? "操作失败", status: "error" });
        }
      } catch (err) {
        showRequestError(err, "请求出错：");
      }
    },
    [runRoomAction, getRoomData, showRequestError],
  );

  // 键盘事件处理
  const handleSetPassEnter = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      handleSetRoomPasswd(inputPasswd);
    }
  };

  const handleJoinRoomEnter = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      handleJoinRoom(inputRoomId, inputPasswd);
    }
  };

  const handleCopyRoomInfo = async () => {
    if (!roomData?.room_id || !userWgInfo?.node_alias) return;

    const roomInfo = [
      `联机节点：${userWgInfo.node_alias}`,
      `房间号：${roomData.room_id}`,
      ...(roomData.room_passwd ? [`房间密码：${roomData.room_passwd}`] : []),
    ].join("\n");

    await copyText(roomInfo);
  };

  // 节点警告文案（根据网络类型）
  const nodeWarningText = useMemo(() => {
    const netType = userWgInfo?.net_type;
    if (netType === "电信") {
      return "你选的是电信线路节点，建议用户都是用中国电信或流量上网时使用，否则联机容易卡顿";
    }
    // else if (netType === "境外") {
    //   return "你选的是境外线路节点，只建议中国大陆外的用户使用";
    // }
    return null;
  }, [userWgInfo?.net_type]);

  const nodeWarningElement = useMemo(() => {
    if (!nodeWarningText) return null;
    return (
      <Text mt={2} color="warning.text" fontSize="xs" textAlign="left">
        {nodeWarningText}
      </Text>
    );
  }, [nodeWarningText]);

  const filteredRoomGames = useMemo(
    () =>
      ROOM_GAME_LIST.filter((game) =>
        game.title.toLowerCase().includes(gameSearchTerm.toLowerCase()),
      ),
    [gameSearchTerm],
  );

  const roomGame = useMemo(
    () =>
      selectedGame ??
      ROOM_GAME_LIST.find(
        (game) => getRoomGameName(game) === roomData?.room_game,
      ) ??
      null,
    [selectedGame, roomData?.room_game],
  );

  // 待加入页面（未进房间）：加入房间 + 创建房间
  const standbyPage = () => (
    <Box>
      <VStack spacing={3} align="stretch">
        <Modal
          isOpen={gameInfo !== null}
          onClose={() => setGameInfo(null)}
          isCentered
        >
          <ModalOverlay />
          <ModalContent {...MODAL_STYLE}>
            <ModalHeader>{gameInfo?.title}</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              {gameInfo?.qq && (
                <Text
                  onClick={() => {
                    if (gameInfo.qq) copyText(gameInfo.qq);
                  }}
                  mb={4}
                  cursor="pointer"
                >
                  该游戏的喵服QQ群{" "}
                  <Text as="span" fontWeight="bold" color="brand.text">
                    {gameInfo.qq}
                  </Text>
                  <Icon
                    ml={1}
                    as={MdContentCopy}
                    boxSize={3}
                    color="brand.text"
                  />
                </Text>
              )}

              <SectionTitle>联机支持情况</SectionTitle>
              {gameInfo?.support && gameInfo.support.length > 0 ? (
                <VStack align="stretch" spacing={2} mt={2}>
                  {gameInfo.support.map((item) => (
                    <Text key={item} fontSize="sm" lineHeight="1.7">
                      • {item}
                    </Text>
                  ))}
                </VStack>
              ) : (
                <Text mt={2} fontSize="sm" color="text.muted">
                  具体平台、版本和主机方向请先查看该游戏教程中的说明。
                </Text>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>

        <Modal
          isOpen={isSponsorNoticeOpen}
          onClose={closeSponsorNotice}
          isCentered
        >
          <ModalOverlay />
          <ModalContent {...MODAL_STYLE}>
            <ModalBody>
              <Text mt={3}>{sponsorNotice}</Text>
              <Text fontSize="sm" color="text.faint">
                注：仅需房主赞助
              </Text>
              {sponsorNotice.includes("10元") ? (
                <Text color="warning.text">
                  赞助专用节点拥挤度低，带宽更大，联机更稳定
                </Text>
              ) : (
                <Text color="warning.text">
                  该跨境联机节点支持国内外玩家联机
                </Text>
              )}
            </ModalBody>
            <ModalFooter gap={3}>
              <Button variant="ghost" onClick={closeSponsorNotice}>
                稍后再说
              </Button>
              <Button
                colorScheme="orange"
                onClick={() => {
                  closeSponsorNotice();
                  navigate("/sponsor");
                }}
              >
                查看赞助方式
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Box {...CARD_STYLE} {...CARD_PADDING}>
          <SectionTitle>加入房间</SectionTitle>

          <Flex gap={2} mt={2}>
            <Input
              placeholder="房间号"
              value={inputRoomId}
              onChange={(e) => {
                setInputRoomId(e.target.value);
                setHideJoinPassInput(true);
              }}
              onKeyDown={handleJoinRoomEnter}
              {...INPUT_STYLE}
            />
            <Button
              size="sm"
              px={5}
              flexShrink={0}
              onClick={() => {
                handleJoinRoom(inputRoomId, inputPasswd);
              }}
            >
              加入
            </Button>
          </Flex>

          <Collapse in={!hideJoinPassInput} animateOpacity>
            <Input
              mt={2}
              placeholder="房间密码（房主设置的）"
              value={inputPasswd}
              onChange={(e) => {
                setInputPasswd(e.target.value);
              }}
              onKeyDown={handleJoinRoomEnter}
              {...INPUT_STYLE}
            />
          </Collapse>
        </Box>

        <Box {...CARD_STYLE} {...CARD_PADDING}>
          <SectionTitle>创建房间</SectionTitle>

          <InputGroup mt={2}>
            <InputLeftElement pointerEvents="none">
              <Icon as={MdSearch} color="text.faint" />
            </InputLeftElement>
            <Input
              pl={9}
              placeholder="搜索游戏名称"
              value={gameSearchTerm}
              onChange={(e) => setGameSearchTerm(e.target.value)}
              {...INPUT_STYLE}
            />
          </InputGroup>

          {filteredRoomGames.length === 0 ? (
            <Text py={6} textAlign="center" fontSize="sm" color="text.faint">
              未找到相关游戏，请使用「通用联机房」
            </Text>
          ) : (
            <VStack spacing={1} align="stretch" mt={2}>
              {filteredRoomGames.map((game) => (
                <Flex
                  key={game.path}
                  align="center"
                  gap={3}
                  py={1.5}
                  px={1}
                  borderRadius="lg"
                  transition="background 0.2s"
                  _hover={{ bg: "bg.hover" }}
                >
                  <Image
                    src={game.icon}
                    alt={game.title}
                    boxSize="40px"
                    objectFit="cover"
                    borderRadius="lg"
                    flexShrink={0}
                    bg="bg.subtle"
                  />

                  <Box flex={1} minW={0} textAlign="left">
                    <Text fontWeight="bold" color="text.main" isTruncated>
                      {game.title}
                    </Text>
                    <Flex
                      as="button"
                      align="center"
                      gap={1}
                      fontSize="xs"
                      color="brand.text"
                      onClick={() => setGameInfo(game)}
                      _hover={{ textDecoration: "underline" }}
                    >
                      <Icon as={MdInfoOutline} boxSize={3.5} />
                      查看联机支持情况
                    </Flex>
                  </Box>

                  <Button
                    size="sm"
                    px={4}
                    flexShrink={0}
                    onClick={() => {
                      handleCreateRoom(game);
                    }}
                  >
                    创建
                  </Button>
                </Flex>
              ))}
            </VStack>
          )}
        </Box>
      </VStack>
    </Box>
  );

  // 已加入页面：房间信息 + 成员列表 + 房间操作
  const joinedPage = () => {
    const hosterIp = roomData?.hoster_ip;

    return (
      <Box>
        <VStack spacing={3} align="stretch">
          <Box {...CARD_STYLE} {...CARD_PADDING}>
            <Flex align="center" justify="space-between" gap={3}>
              <Box minW={0}>
                <SectionTitle>房间号（点击复制）</SectionTitle>
                <Text
                  fontSize="2xl"
                  fontWeight="bold"
                  lineHeight="1.3"
                  cursor="pointer"
                  onClick={handleCopyRoomInfo}
                  title="点击复制房间信息"
                  textAlign="center"
                >
                  {roomData?.room_id}
                  <Icon
                    ml={1.5}
                    as={MdContentCopy}
                    boxSize={4}
                    color="brand.text"
                  />
                </Text>
              </Box>

              <HStack spacing={2} flexShrink={0}>
                {roomRole === ROLE_HOSTER && (
                  <Button
                    size="sm"
                    px={4}
                    onClick={() => {
                      setInputPasswd(
                        roomData?.room_passwd ? roomData.room_passwd : "",
                      );
                      setPassOnOpen();
                    }}
                  >
                    {roomData?.room_passwd ? "修改密码" : "设置密码"}
                  </Button>
                )}
              </HStack>
            </Flex>

            {roomGame && (
              <>
                <Divider my={2.5} />

                <Flex align="center" gap={2}>
                  <Image
                    src={roomGame.icon}
                    alt={roomGame.title}
                    boxSize="28px"
                    objectFit="cover"
                    borderRadius="md"
                    flexShrink={0}
                    bg="bg.subtle"
                  />
                  <Text fontWeight="bold" isTruncated flex={1} textAlign="left">
                    {roomGame.title}
                  </Text>
                  <Button
                    size="sm"
                    px={4}
                    flexShrink={0}
                    onClick={() => navigate(roomGame.path)}
                  >
                    联机教程
                  </Button>
                </Flex>
              </>
            )}
          </Box>

          {roomGame?.title === "逃脱者手游" && <TheEscapistsTool />}

          <Box {...CARD_STYLE} {...CARD_PADDING}>
            <Flex align="center" justify="space-between">
              <SectionTitle>成员</SectionTitle>

              <Text ml={2} fontSize="xs" color="text.faint">
                点刷新房间才会更新
              </Text>

              {roomRole === ROLE_HOSTER && (
                <Text
                  ml="auto"
                  mr={3}
                  fontSize="sm"
                  fontWeight="bold"
                  as="button"
                  color="brand.text"
                  onClick={() => navigate("/sponsor")}
                >
                  提升人数
                </Text>
              )}

              <Text fontSize="sm" color="text.muted">
                <Text
                  as="span"
                  fontSize="md"
                  fontWeight="bold"
                  color="text.main"
                >
                  {roomData?.members.length}
                </Text>
                /{roomData?.room_max} 人
              </Text>
            </Flex>

            <VStack spacing={2} align="stretch" mt={2}>
              {roomData?.members.map((item) => {
                const isMe = item.ip === userWgInfo?.user_ip;
                const isHoster = item.ip === hosterIp;

                return (
                  <Box
                    key={item.ip}
                    px={2.5}
                    py={2}
                    borderRadius="control"
                    bg="bg.subtle"
                    border="1px solid"
                    borderColor="border.line"
                  >
                    <Flex align="center" gap={2}>
                      {item.sponsorship > 0 && (
                        <SponsorTag amount={item.sponsorship} />
                      )}

                      <Text
                        fontWeight="bold"
                        color="text.main"
                        isTruncated
                        flex={1}
                        textAlign="left"
                      >
                        {item.username}
                        {isMe && ` (我)`}
                      </Text>

                      <Text
                        fontSize="sm"
                        fontWeight="bold"
                        color={getStatusColor(item.status === "在线")}
                        flexShrink={0}
                      >
                        {item.status}
                      </Text>
                    </Flex>

                    <Flex align="center" gap={2} mt={1}>
                      <Flex
                        as="button"
                        align="center"
                        gap={1}
                        fontSize="sm"
                        color="text.muted"
                        onClick={() => {
                          copyText(item.ip);
                        }}
                        _hover={{ color: "text.main" }}
                        minW={0}
                      >
                        <Text as="span" fontSize="xs" color="text.faint">
                          喵服IP
                        </Text>
                        <Text isTruncated>{item.ip}</Text>
                        <Icon
                          as={MdContentCopy}
                          boxSize={3}
                          color="brand.text"
                          flexShrink={0}
                        />
                      </Flex>

                      {roomRole === ROLE_HOSTER && !isHoster && (
                        <Tag
                          ml="auto"
                          size="sm"
                          color="white"
                          bg="danger.solid"
                          fontWeight="bold"
                          flexShrink={0}
                          cursor="pointer"
                          _hover={{ bg: "danger.solidHover" }}
                          onClick={() => handleDelMember(item.ip)}
                        >
                          踢出
                        </Tag>
                      )}
                    </Flex>
                  </Box>
                );
              })}
            </VStack>
          </Box>

          <HStack spacing={3} justify="center">
            <Button
              size="sm"
              px={4}
              colorScheme="red"
              onClick={() =>
                handleLeaveRoom(
                  roomRole === ROLE_HOSTER ? "closeRoom" : "exitRoom",
                )
              }
            >
              {roomRole === ROLE_HOSTER ? "关闭房间" : "退出房间"}
              <Box as="span" ml={1} display="inline-flex">
                <IoIosExit size={18} />
              </Box>
            </Button>

            <Button
              size="sm"
              px={4}
              variant="ghost"
              color="brand.text"
              disabled={disableFlush}
              onClick={() => {
                getRoomData(false);
              }}
            >
              <Box
                as="span"
                display="inline-flex"
                animation={rotate ? `${spin} 1s linear infinite` : "none"}
              >
                <TbReload size={16} />
              </Box>
              <Text ml={1} fontSize="sm">
                刷新房间
              </Text>
            </Button>
          </HStack>
        </VStack>

        <Modal isOpen={setPassIsOpen} onClose={setPassOnClose} isCentered>
          <ModalOverlay />
          <ModalContent {...MODAL_STYLE}>
            <ModalHeader>设置加入房间的密码</ModalHeader>
            <ModalCloseButton />
            <ModalBody onKeyDown={handleSetPassEnter}>
              <Input
                placeholder="请输入房间密码"
                value={inputPasswd}
                onChange={(e) => setInputPasswd(e.target.value)}
                {...INPUT_STYLE}
              />
            </ModalBody>
            <ModalFooter>
              <Button
                display={roomData?.room_passwd ? "block" : "none"}
                colorScheme="red"
                onClick={() => handleSetRoomPasswd("")}
              >
                清除密码
              </Button>
              <Button ml={3} onClick={() => handleSetRoomPasswd(inputPasswd)}>
                {roomData?.room_passwd ? "更新密码" : "设置密码"}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    );
  };

  return (
    <Flex direction="column" align="center" pb={6}>
      {!userInfo ? (
        <VStack spacing={3} align="center">
          <Heading size="md">你还没登录呢</Heading>
          <Button onClick={openLoginModal}>点击登录</Button>
          <NoticeText />
        </VStack>
      ) : (
        <VStack
          spacing={3}
          w="100%"
          maxW={{ base: "100%", md: "560px" }}
          align="stretch"
        >
          {/* 轮播公告 */}
          <AnnouncementCarousel />

          {/* 当前节点 */}
          {userWgInfo?.node_alias && nodeNetLoad !== undefined ? (
            <Box {...CARD_STYLE} {...CARD_PADDING}>
              <Flex align="center" gap={{ base: 2, md: 3 }}>
                <Badge
                  // colorScheme="orange"
                  fontSize="xs"
                >
                  {userWgInfo.net_type}
                </Badge>
                <Badge
                  // colorScheme="teal"
                  fontSize="xs"
                >
                  {userWgInfo.bandwidth}M
                </Badge>

                {/* 节点名称：占据中间剩余空间并居中 */}
                <Text
                  flex={1}
                  minW={0}
                  textAlign="center"
                  fontWeight="bold"
                  fontSize="lg"
                  color="text.main"
                  isTruncated
                  title={userWgInfo.node_alias}
                >
                  {userWgInfo.node_alias}
                </Text>

                {/* 负载情况 + 切换节点：右 */}
                <Flex align="center" gap={{ base: 2, md: 3 }} flexShrink={0}>
                  <Flex align="center" gap={1.5}>
                    <Box
                      w="8px"
                      h="8px"
                      borderRadius="full"
                      bg={getNetColor(nodeNetLoad)}
                    />
                    <Text fontSize="xs" color="text.muted">
                      {getNetText(nodeNetLoad)}
                    </Text>
                  </Flex>

                  <Button
                    ml={2}
                    size="sm"
                    px={3}
                    onClick={() => {
                      if (roomRole === ROLE_NONE) setNodeListModal();
                      else
                        openToast({
                          content: `${roomRole === ROLE_HOSTER ? "关闭" : "退出"}房间后再切换`,
                          status: "warning",
                        });
                    }}
                  >
                    切换
                  </Button>
                </Flex>
              </Flex>

              {roomRole === ROLE_HOSTER && nodeWarningElement}
            </Box>
          ) : (
            <Center {...CARD_STYLE} py={4} gap={2}>
              <Text fontSize="sm" color="text.faint">
                节点数据加载中
              </Text>
              <Spinner size="sm" />
            </Center>
          )}

          {/* 连接状态 */}
          <Box {...CARD_STYLE} {...CARD_PADDING}>
            <Flex align="center" justify="space-between" gap={2}>
              <HStack spacing={2} minW={0}>
                <Box
                  w="8px"
                  h="8px"
                  borderRadius="full"
                  bg={getStatusColor(isOnline)}
                  flexShrink={0}
                />
                <Text fontWeight="bold" color={getStatusColor(isOnline)}>
                  {isOnline ? "WG在线" : "WG离线"}
                </Text>

                {isOnline && latency !== undefined ? (
                  <Flex align="center" color={getDelayColor(latency)}>
                    {getDelayIcon(latency)}
                    <Text as="span" fontWeight="bold" ml={0.5}>
                      {latency}ms
                    </Text>
                  </Flex>
                ) : (
                  <Icon as={RiSignalCellularOffLine} color="text.faint" />
                )}
              </HStack>

              {!isOnline && (
                <Text mr="auto" fontSize="xs" color="text.faint">
                  要安装WG客户端
                </Text>
              )}

              <Button
                size="sm"
                px={3}
                variant="ghost"
                color="brand.text"
                disabled={disableFlush}
                flexShrink={0}
                onClick={() => {
                  getRoomData(false);
                }}
              >
                <Box
                  as="span"
                  display="inline-flex"
                  animation={rotate ? `${spin} 1s linear infinite` : "none"}
                >
                  <TbReload size={16} />
                </Box>
                <Text ml={1} fontSize="sm">
                  刷新
                </Text>
              </Button>
            </Flex>

            {isOnline === false && (
              <Flex
                align="center"
                justify="center"
                gap={2}
                mt={1.5}
                fontSize="sm"
              >
                <Text
                  as="button"
                  color="brand.text"
                  onClick={() => {
                    navigate("/offlineCheck");
                  }}
                >
                  隧道打开了还是离线或掉线排查
                </Text>
              </Flex>
            )}
          </Box>

          {roomRole === ROLE_NONE ? standbyPage() : joinedPage()}
        </VStack>
      )}
    </Flex>
  );
}
