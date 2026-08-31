import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import {
  Box,
  Text,
  Input,
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
  Badge,
  Stack,
  Image,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { openToast } from "@/components/universal/toast";
import { Button } from "@/components/universal/button";
import { IoReloadCircle } from "react-icons/io5";
import { TbReload } from "react-icons/tb";
import { useUserStateStore } from "@/store/user-state";
import { getAuthToken } from "@/store/authKey";
import {
  copyText,
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
import AnnouncementsModal from "@/components/docs/Announcement";
import SponsorTag from "@/components/universal/SponsorTag";
import OfflineReasons from "@/components/docs/OfflineReasons";
import { apiUrl } from "@/utils/api";

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

interface HandleRoomResponse {
  code: number;
  msg: string;
  [key: string]: any;
}

interface GameRoomItem {
  path: string;
  title: string;
  icon: string;
}

const ROOM_GAME_LIST: GameRoomItem[] = [
  { path: "/docs", title: "通用联机房", icon: "/images/universal/icon.webp" },
  {
    path: "/docs/stardewValley",
    title: "星露谷物语",
    icon: "/images/stardewValley/icon.webp",
  },
  {
    path: "/docs/doNotStarve",
    title: "饥荒联机版",
    icon: "/images/doNotStarve/icon.webp",
  },
  {
    path: "/docs/slayTheSpire",
    title: "杀戮尖塔",
    icon: "/images/slayTheSpire/icon.webp",
  },
  {
    path: "/docs/terraria",
    title: "泰拉瑞亚",
    icon: "/images/terraria/icon.webp",
  },
  {
    path: "/docs/theEscapists",
    title: "逃脱者手游",
    icon: "/images/theEscapists/icon.webp",
  },
  {
    path: "/docs/mindustry",
    title: "像素工厂",
    icon: "/images/mindustry/icon.webp",
  },
  {
    path: "/docs/l4d2",
    title: "求生之路2",
    icon: "/images/l4d2/icon.webp",
  },
  {
    path: "/docs/ark",
    title: "方舟：生存进化",
    icon: "/images/ark/icon.webp",
  },

  {
    path: "/docs/isaac",
    title: "以撒的结合",
    icon: "/images/isaac/icon.webp",
  },
  {
    path: "/docs/survivalcraft",
    title: "生存战争",
    icon: "/images/survivalcraft/icon.webp",
  },
  {
    path: "/docs/wizardOfLegend",
    title: "传说法师手游",
    icon: "/images/wizardOfLegend/icon.webp",
  },
  {
    path: "/docs/overcooked",
    title: "胡闹厨房",
    icon: "/images/overcooked/icon.webp",
  },
  {
    path: "/docs/machinesAtWar3",
    title: "机械战争3",
    icon: "/images/machinesAtWar3/icon.webp",
  },
  {
    path: "/docs/projectZomboid",
    title: "僵尸毁灭工程",
    icon: "/images/projectZomboid/icon.webp",
  },
  {
    path: "/docs/juicyRealm",
    title: "恶果之地",
    icon: "/images/juicyRealm/icon.webp",
  },
  {
    path: "/docs/aresVirus2",
    title: "阿瑞斯病毒2",
    icon: "/images/aresVirus2/icon.webp",
  },
];

// 抽取常量到组件外部，避免每次渲染重新创建
const CAROUSEL_MESSAGES = [
  "关闭浏览器不影响联机，WG不关即可",
  "联机时使用该页面上显示的联机IP",
  "房间里任意玩家都可以当主机",
];

// 抽取角色常量
const ROLE_HOSTER = "hoster";
const ROLE_NONE = "none";

export default function Page() {
  const navigate = useNavigate();

  // 使用 useRef 作为并发请求锁，解决 useState 异步更新导致的竞态问题
  const isRequesting = useRef(false);

  const {
    isOpen: setPassIsOpen,
    onOpen: setPassOnOpen,
    onClose: setPassOnClose,
  } = useDisclosure();

  const [hideJoinPassInput, setHideJoinPassInput] = useState(true);

  const [inputRoomId, setInputRoomId] = useState("");
  const [inputPasswd, setInputPasswd] = useState("");
  const [gameSearchTerm, setGameSearchTerm] = useState("");
  const {
    userInfo,
    userWgInfo,
    roomData,
    getRoomData,
    setRoomPassword,
    roomRole,
    latency,
    isOnline,
    rotate,
    disableFlush,
    setShowLoginModal,
    setNodeListModal,
    setOfflineReasonsModal,
    nodeNetLoad,
  } = useUserStateStore();

  useEffect(() => {
    // 当节点存在，且还没有房间数据时，自动拉取
    if (userWgInfo?.node_alias && roomData === undefined) {
      getRoomData();
    }
  }, [userWgInfo?.node_alias, roomData, getRoomData]);

  // 轮播图索引
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIndex(
        (prevIndex) => (prevIndex + 1) % CAROUSEL_MESSAGES.length,
      );
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // 判断是否为 VIP 用户（赞助 > 10）
  const isVip = useMemo(
    () => (userInfo?.sponsorship || 0) > 10,
    [userInfo?.sponsorship],
  );

  // 通用请求函数：使用 useRef 锁，避免 useCallback 依赖 loading 状态导致频繁重建
  const requestRoomApi = useCallback(
    async (
      endpoint: string,
      params: Record<string, string> = {},
    ): Promise<HandleRoomResponse> => {
      if (isRequesting.current) {
        throw new Error("请不要点太快");
      }
      isRequesting.current = true;

      try {
        const urlParams = new URLSearchParams(params);
        const url = `${apiUrl}/${endpoint}?${urlParams.toString()}`;

        const resp = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        });

        if (!resp.ok) {
          throw new Error(`访问接口出错: ${resp.status}`);
        }

        const data: HandleRoomResponse = await resp.json();

        if (data.code === -1) {
          window.location.reload();
        }

        return data;
      } finally {
        isRequesting.current = false;
      }
    },
    [], // 无依赖，保持完全稳定
  );

  // 设置房间密码
  const handleSetRoomPasswd = useCallback(
    async (newPasswd: string) => {
      try {
        const data = await requestRoomApi("setRoomPasswd", {
          roomPasswd: newPasswd,
        });

        if (data.code === 0) {
          if (roomData) {
            setRoomPassword(newPasswd);
          }
          openToast({ content: data.msg, status: "success" });
          setPassOnClose();
        } else {
          openToast({ content: data.msg, status: "warning" });
        }
      } catch (err) {
        openToast({ content: String(err), status: "error" });
      }
    },
    [requestRoomApi, roomData, setRoomPassword, setPassOnClose],
  );

  // 创建房间
  const handleCreateRoom = useCallback(
    async (game?: GameRoomItem) => {
      try {
        const data = await requestRoomApi("handleRoom", {
          handleType: "createRoom",
          value: "",
        });
        if (data.code === 0) {
          getRoomData();
          if (game?.path) {
            navigate(game.path);
          }
        } else {
          if (data.msg.includes("在线")) {
            getRoomData();
          }
          openToast({ content: data.msg, status: "warning" });
        }
      } catch (err) {
        openToast({ content: String(err), status: "error" });
      }
    },
    [requestRoomApi, getRoomData, navigate],
  );

  // 关闭房间（房主）
  const handleCloseRoom = useCallback(async () => {
    try {
      const data = await requestRoomApi("handleRoom", {
        handleType: "closeRoom",
        value: "",
      });
      if (data.code === 0) {
        getRoomData();
      } else {
        openToast({ content: data.msg, status: "error" });
      }
    } catch (err) {
      openToast({ content: `请求出错: ${String(err)}`, status: "error" });
    }
  }, [requestRoomApi, getRoomData]);

  // 退出房间（成员）
  const handleExitRoom = useCallback(async () => {
    try {
      const data = await requestRoomApi("handleRoom", {
        handleType: "exitRoom",
        value: "",
      });
      if (data.code === 0) {
        getRoomData();
      } else {
        openToast({ content: data.msg, status: "error" });
      }
    } catch (err) {
      openToast({ content: `请求出错: ${String(err)}`, status: "error" });
    }
  }, [requestRoomApi, getRoomData]);

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
        const data = await requestRoomApi("handleRoom", {
          handleType: "joinRoom",
          value: roomId,
          roomPasswd: passwd,
        });

        if (data.code === 0) {
          getRoomData();
          setHideJoinPassInput(true);
          setInputRoomId("");
          setInputPasswd("");
        } else {
          if (data.msg.includes("密码")) {
            setHideJoinPassInput(false);
          }
          if (data.msg.includes("在线")) {
            getRoomData();
          }
          openToast({ content: data.msg, status: "warning" });
        }
      } catch (err) {
        openToast({ content: `请求出错: ${String(err)}`, status: "error" });
      }
    },
    [requestRoomApi, getRoomData],
  );

  // 踢出成员
  const handleDelMember = useCallback(
    async (delIp: string) => {
      try {
        const data = await requestRoomApi("handleRoom", {
          handleType: "delMember",
          value: delIp,
        });
        if (data.code === 0) {
          getRoomData();
        } else {
          openToast({ content: data.msg, status: "error" });
        }
      } catch (err) {
        openToast({ content: `请求出错: ${String(err)}`, status: "error" });
      }
    },
    [requestRoomApi, getRoomData],
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

  // 节点警告文案（根据网络类型）
  const nodeWarningText = useMemo(() => {
    const netType = userWgInfo?.net_type;
    if (netType === "电信") {
      return "你选的是电信线路节点，只建议所有用户都是用中国电信或流量的时候使用";
    } else if (netType === "境外") {
      return "你选的是境外线路节点，中国大陆用户会不稳定或无法连接";
    }
    return null;
  }, [userWgInfo?.net_type]);

  const nodeWarningElement = useMemo(() => {
    if (!nodeWarningText) return null;
    return (
      <Text color="#ffca3d" size="sm" textAlign="center" mx={5}>
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

  // 待加入页面（未进房间）
  const standbyPage = () => (
    <Box textAlign="center" w="100%" maxW="760px">
      <VStack spacing={1} w="100%">
        <Box
          w={{ md: "320px", base: "100%" }}
          borderRadius="lg"
          overflow="hidden"
        >
          <Flex
            align="center"
            justify="space-between"
            w="100%"
            px={3}
            py={3}
            borderBottom="1px solid rgba(255,255,255,0.08)"
            bg="rgba(52, 139, 246, 0.18)"
          >
            <Input
              type="text"
              placeholder="房间号"
              value={inputRoomId}
              onChange={(e) => {
                setInputRoomId(e.target.value);
                setHideJoinPassInput(true);
              }}
              bg="rgba(0,0,0,0.12)"
              border="1px solid rgba(255,255,255,0.15)"
              color="white"
              _placeholder={{ color: "rgba(255,255,255,0.6)" }}
              mr={3}
              onKeyDown={handleJoinRoomEnter}
            />
            <Button
              size="sm"
              minW="60px"
              onClick={() => {
                handleJoinRoom(inputRoomId, inputPasswd);
              }}
            >
              加入
            </Button>
          </Flex>

          {!hideJoinPassInput && (
            <Flex
              align="center"
              justify="space-between"
              w="100%"
              px={3}
              py={3}
              borderBottom="1px solid rgba(255,255,255,0.08)"
              bg="rgba(75, 127, 187, 0.14)"
            >
              <Input
                type="text"
                placeholder="请输入房间密码"
                value={inputPasswd}
                onChange={(e) => {
                  setInputPasswd(e.target.value);
                }}
                bg="rgba(0,0,0,0.12)"
                border="1px solid rgba(255,255,255,0.15)"
                color="white"
                _placeholder={{ color: "rgba(255,255,255,0.6)" }}
                onKeyDown={handleJoinRoomEnter}
              />
            </Flex>
          )}
        </Box>

        <Box
          w={{ md: "320px", base: "100%" }}
          mb={10}
          borderRadius="lg"
          overflow="hidden"
          border="1px solid rgba(255,255,255,0.08)"
          bg="rgba(52, 139, 246, 0.18)"
        >
          <Flex align="center" justify="space-between" w="100%" px={3} py={3}>
            <Input
              value={gameSearchTerm}
              onChange={(e) => setGameSearchTerm(e.target.value)}
              placeholder="搜索游戏"
              bg="rgba(0,0,0,0.12)"
              border="1px solid rgba(255,255,255,0.15)"
              color="white"
              _placeholder={{ color: "rgba(255,255,255,0.6)" }}
            />
          </Flex>

          {filteredRoomGames.length === 0 ? (
            <Flex w="100%" px={3} pb={3} justify="center">
              <Text color="rgba(255,255,255,0.7)">
                未找到相关游戏
                <br />
                请使用通用联机房
              </Text>
            </Flex>
          ) : (
            filteredRoomGames.map((game) => (
              <Flex
                key={game.path}
                align="center"
                justify="space-between"
                w="100%"
                px={3}
                py={3}
                borderBottom="1px solid rgba(255,255,255,0.08)"
              >
                <Flex align="center" minW={0} flex={1} pr={3}>
                  <Image
                    src={game.icon}
                    alt={game.title}
                    boxSize="42px"
                    objectFit="cover"
                    borderRadius="md"
                    flexShrink={0}
                    bg="rgba(255,255,255,0.08)"
                  />
                  <Text
                    ml={3}
                    fontSize="md"
                    fontWeight="bold"
                    color="white"
                    textAlign="left"
                    isTruncated
                  >
                    {game.title}
                  </Text>
                </Flex>

                <Button
                  size="sm"
                  minW="60px"
                  onClick={() => {
                    handleCreateRoom(game);
                  }}
                >
                  创建
                </Button>
              </Flex>
            ))
          )}
        </Box>
      </VStack>
    </Box>
  );

  // 已加入页面
  const joinedPage = () => (
    <Box textAlign="center">
      <Modal isOpen={setPassIsOpen} onClose={setPassOnClose}>
        <ModalOverlay />
        <ModalContent bgColor="#002f5c">
          <ModalHeader>设置加入房间的密码</ModalHeader>
          <ModalCloseButton />
          <ModalBody onKeyDown={handleSetPassEnter}>
            <Input
              type="text"
              placeholder="请输入房间密码"
              value={inputPasswd}
              onChange={(e) => setInputPasswd(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button bgColor="#be2b2b" onClick={() => handleSetRoomPasswd("")}>
              清除密码
            </Button>
            <Button
              ml={3}
              bgColor="#007bc0"
              onClick={() => handleSetRoomPasswd(inputPasswd)}
            >
              更新密码
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <VStack>
        {roomData?.members.length === 1 && roomRole === ROLE_HOSTER && (
          <Text color="#ffca3d" size="sm" textAlign="center">
            所有玩家都要注册喵服并安装WG
            <br />
            然后邀请他们加入房间才能联机
          </Text>
        )}

        {roomData?.members.map((item) => (
          <Box
            w="300px"
            key={item.ip}
            bg="rgb(75 127 187 / 38%)"
            p={1}
            borderRadius={12}
            borderColor={
              item.ip === userWgInfo?.user_ip ? "#6db4ff" : "transparent"
            }
            borderWidth={3}
          >
            <Flex>
              <Text fontWeight="bold" fontSize="1.1rem" ml={2} color="white">
                {item.username}
              </Text>
              <Tag
                size="md"
                ml="auto"
                bg="transparent"
                fontWeight="bold"
                color={getStatusColor(item.status === "在线")}
              >
                {item.status}
              </Tag>
            </Flex>

            <Flex mt={1}>
              <Tag
                onClick={() => {
                  copyText(item.ip);
                }}
                color="white"
                bg="transparent"
                cursor="pointer"
              >
                联机ip {item.ip}
              </Tag>

              {item.sponsorship > 0 && <SponsorTag amount={item.sponsorship} />}

              {roomRole === ROLE_HOSTER && item.ip !== roomData.hoster_ip && (
                <Tag
                  ml="auto"
                  color="white"
                  bg="#be1c1c"
                  onClick={() => handleDelMember(item.ip)}
                  cursor="pointer"
                >
                  踢出
                </Tag>
              )}
            </Flex>
          </Box>
        ))}

        {roomData?.members.length === 1 &&
          roomRole === ROLE_HOSTER &&
          nodeWarningElement}
      </VStack>

      <HStack justify="center">
        <Button
          px={0}
          size="lg"
          bg="transparent"
          onClick={roomRole === ROLE_HOSTER ? handleCloseRoom : handleExitRoom}
        >
          {roomRole === ROLE_HOSTER ? "关闭房间" : "退出房间"}
          <IoIosExit size={30} color="#ff4444" />
        </Button>

        <Text fontSize="lg" fontWeight="bold" ml={2} mr={3}>
          {roomData?.members.length}/{roomData?.room_max}
        </Text>

        <Button
          px={0}
          size="lg"
          bg="transparent"
          disabled={disableFlush}
          onClick={() => {
            getRoomData(false);
          }}
        >
          刷新房间
          <IoReloadCircle size={26} color="#35c535" />
        </Button>
      </HStack>

      {roomData && roomData?.room_max === 2 && (
        <Text fontSize="sm" color="#ffca3d">
          如需增加房间人数请看赞助页面说明
        </Text>
      )}
    </Box>
  );

  return (
    <Flex direction="column" px={{ base: 4, md: 8 }} align="center">
      <AnnouncementsModal />

      {!userInfo ? (
        <VStack spacing={3} align="center">
          <Heading size="md">你还没登录呢</Heading>
          <Button
            variant="outline"
            rounded={10}
            onClick={setShowLoginModal}
            border={0}
          >
            点击登录
          </Button>
          <NoticeText />
        </VStack>
      ) : (
        <>
          {userWgInfo?.node_alias && roomData !== undefined && (
            <>
              <Flex
                align="center"
                justify="space-between"
                borderRadius="lg"
                boxShadow="sm"
                mb={2}
                bg="rgba(52, 139, 246, 0.18)"
                border="1px solid"
                borderColor="rgba(75, 127, 187, 0.2)"
                px={3}
                py={2}
                w="100%"
                maxW="320px"
              >
                <Stack spacing={1} w="44px" flexShrink={0}>
                  <Badge
                    colorScheme="orange"
                    fontSize="xs"
                    textAlign="center"
                    px={1}
                  >
                    {userWgInfo.net_type}
                  </Badge>
                  <Badge
                    colorScheme="teal"
                    fontSize="xs"
                    textAlign="center"
                    px={1}
                  >
                    {userWgInfo.bandwidth}M
                  </Badge>
                </Stack>

                <Flex
                  flex="1"
                  alignItems="center"
                  justifyContent="center"
                  gap={2}
                  minW={0}
                  px={2}
                >
                  <Text
                    fontWeight="bold"
                    fontSize="lg"
                    isTruncated
                    title={userWgInfo?.node_alias}
                    color="white"
                    letterSpacing="-0.3px"
                  >
                    {userWgInfo?.node_alias}
                  </Text>

                  <Flex
                    alignItems="center"
                    gap={1}
                    flexShrink={0}
                    bg="rgba(0,0,0,0.04)"
                    mx={1}
                    borderRadius="full"
                  >
                    <Box
                      w="10px"
                      h="10px"
                      borderRadius="full"
                      bg={getNetColor(nodeNetLoad)}
                      boxShadow="0 0 4px rgba(0,0,0,0.1)"
                    />
                    <Text
                      fontSize="xs"
                      fontWeight="medium"
                      color="white"
                      whiteSpace="nowrap"
                    >
                      {getNetText(nodeNetLoad)}
                    </Text>
                  </Flex>
                </Flex>

                <Button
                  rounded="full"
                  onClick={setNodeListModal}
                  size="sm"
                  bg="linear-gradient(135deg, #007bc0, #005a9e)"
                  color="white"
                  fontWeight="medium"
                  px={3}
                  flexShrink={0}
                >
                  切换节点
                </Button>
              </Flex>

              <Flex align="center" mt={1} gap={2}>
                <Text
                  fontSize={18}
                  fontWeight="bold"
                  color={getStatusColor(isOnline)}
                >
                  {isOnline ? "在线" : "WG未连接"}
                </Text>

                {isOnline && latency !== undefined ? (
                  <Flex align="center" color={getDelayColor(latency)}>
                    {getDelayIcon(latency)}
                    <Text as="span" fontWeight="bold">
                      {latency}ms
                    </Text>
                  </Flex>
                ) : (
                  <RiSignalCellularOffLine size={20} />
                )}

                <Button
                  bg="transparent"
                  h={5}
                  px={0}
                  disabled={disableFlush}
                  onClick={() => {
                    getRoomData(false);
                  }}
                  color="#7dd4ff"
                >
                  <Text>刷新</Text>
                  <Box
                    animation={rotate ? `${spin} 1s linear infinite` : "none"}
                  >
                    <TbReload size={18} />
                  </Box>
                </Button>
              </Flex>
            </>
          )}

          <OfflineReasons />

          {roomRole !== ROLE_NONE && (
            <Text fontSize={18} fontWeight="bold" mr={3}>
              <Text
                as="span"
                onClick={() => {
                  if (roomData?.room_id) copyText(roomData.room_id.toString());
                }}
                cursor="pointer"
              >
                房间号&ensp;{roomData?.room_id}
              </Text>
              {roomRole === ROLE_HOSTER && (
                <Button
                  ml={2}
                  color="#7dd4ff"
                  variant="link"
                  bg="transparent"
                  onClick={() => {
                    setInputPasswd(
                      roomData?.room_passwd ? roomData?.room_passwd : "",
                    );
                    setPassOnOpen();
                  }}
                >
                  设置密码
                </Button>
              )}
            </Text>
          )}

          {isOnline === false && (
            <Text color="#ffca3d" size="sm" textAlign="center" mb={2}>
              WG下载和联机教程👉
              <Button
                variant="link"
                bg="transparent"
                color="#7dd4ff"
                onClick={() => {
                  navigate(`/docs`);
                }}
              >
                点我查看
              </Button>
              <br />
              WG隧道打开还是离线👉
              <Button
                variant="link"
                bg="transparent"
                color="#7dd4ff"
                onClick={setOfflineReasonsModal}
              >
                点我排查
              </Button>
            </Text>
          )}

          {isOnline &&
            roomRole !== ROLE_NONE &&
            CAROUSEL_MESSAGES[carouselIndex]}

          {isOnline && (
            <Text size="sm" textAlign="center" mb={2}>
              复习联机教程
              <Button
                variant="link"
                bg="transparent"
                color="#7dd4ff"
                onClick={() => {
                  navigate(`/docs`);
                }}
              >
                👉点我查看
              </Button>
            </Text>
          )}

          {roomRole === ROLE_NONE ? standbyPage() : joinedPage()}
        </>
      )}
    </Flex>
  );
}
