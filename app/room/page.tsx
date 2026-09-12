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
  Link,
  Center,
  Spinner,
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
  qq: string | null;
  support?: string[];
}

const getRoomGameName = (game?: GameRoomItem): string => {
  if (!game || game.path === "/docs") return "";
  return game.path.replace(/^\/docs\//, "");
};

const ROOM_GAME_LIST: GameRoomItem[] = [
  {
    path: "/docs/universal",
    title: "通用联机房",
    icon: "/images/universal/icon.webp",
    qq: null,
    support: [
      "该房间适合任意游戏，只是该房间无特定游戏的联机操作教程",
      "支持通过IP加入游戏都可以用喵服联机，搜索加入的就不好说",
      "游戏列表没你玩的游戏，且不清楚是否能联机，可以加大群问问",
      "如果你希望新增某游戏，请加大群联系群主（服主）",
    ],
  },
  {
    path: "/docs/stardewValley",
    title: "星露谷物语",
    icon: "/images/stardewValley/icon.webp",
    qq: "817658554",
    support: ["支持安卓、苹果、电脑三端跨平台联机（需要游戏版本一致）"],
  },
  {
    path: "/docs/doNotStarve",
    title: "饥荒联机版",
    icon: "/images/doNotStarve/icon.webp",
    qq: "641115719",
    support: [
      "离线模式下，支持安卓与苹果联机（需要游戏版本一致），但仅安卓能加入房间",
      "不支持PC端与移动端联机",
    ],
  },
  {
    path: "/docs/slayTheSpire",
    title: "杀戮尖塔",
    icon: "/images/slayTheSpire/icon.webp",
    qq: "698892019",
    support: [
      "支持安卓、苹果、电脑三端跨平台联机（需要游戏版本一致）",
      "Steam端需要安装IP联机mod才能使用喵服联机，房间内的游戏联机教程有提供",
    ],
  },
  {
    path: "/docs/terraria",
    title: "泰拉瑞亚",
    icon: "/images/terraria/icon.webp",
    qq: "976129564",
    support: [
      "国际版支持安卓、苹果、电脑三端跨平台联机（需要游戏版本一致）",
      "心动代理版仅支持安卓与苹果联机，且不支持与国际版联机",
    ],
  },
  {
    path: "/docs/theEscapists",
    title: "逃脱者手游",
    icon: "/images/theEscapists/icon.webp",
    qq: "961793250",
    support: [
      "支持安卓与苹果联机（需要游戏版本一致），搜索房间需要创建搜房任务，房间内的游戏联机教程有提供",
      "仅支持移动端联机",
    ],
  },
  {
    path: "/docs/mindustry",
    title: "像素工厂",
    icon: "/images/mindustry/icon.webp",
    qq: "830268831",
    support: ["支持安卓、苹果、电脑三端跨平台联机（需要游戏版本一致）"],
  },
  {
    path: "/docs/l4d2",
    title: "求生之路2",
    icon: "/images/l4d2/icon.webp",
    qq: "138012638",
    support: [
      "正版和盗版都支持，但如果卡Steam验证问题需要自己去解决",
      "该游戏只有PC端，别问手机能不能玩了",
    ],
  },
  {
    path: "/docs/ark",
    title: "方舟：生存进化",
    icon: "/images/ark/icon.webp",
    qq: "1106534252",
    support: [
      "手游需要使用“琳星Lin-C”版，否则无法使用IP加入游戏",
      "不支持PC端与移动端联机",
    ],
  },

  {
    path: "/docs/isaac",
    title: "以撒的结合",
    icon: "/images/isaac/icon.webp",
    qq: "1074963191",
    support: [
      "由于不支持IP加入游戏，流量有低概率不走喵服，好不好使自己试试才知道",
      "不支持PC端与移动端联机",
    ],
  },
  {
    path: "/docs/survivalcraft",
    title: "生存战争",
    icon: "/images/survivalcraft/icon.webp",
    qq: "1092247198",
    support: ["支持安卓、苹果、电脑三端跨平台联机（需要游戏版本一致）"],
  },
  {
    path: "/docs/wizardOfLegend",
    title: "传说法师手游",
    icon: "/images/wizardOfLegend/icon.webp",
    qq: "981286541",
    support: [
      "支持安卓与苹果联机，但仅安卓能加入房间",
      "不支持电脑端，因为电脑端没有联机模式",
    ],
  },
  {
    path: "/docs/overcooked",
    title: "胡闹厨房",
    icon: "/images/overcooked/icon.webp",
    qq: null,
    support: [
      "由于不支持IP加入游戏，流量有低概率不走喵服，好不好使自己试试才知道",
    ],
  },
  {
    path: "/docs/machinesAtWar3",
    title: "机械战争3",
    icon: "/images/machinesAtWar3/icon.webp",
    qq: "689358384",
    support: [
      "由于该游戏版本众多，只要有联机模式的都支持，如果有疑问加该游戏的QQ群问问",
    ],
  },
  {
    path: "/docs/projectZomboid",
    title: "僵尸毁灭工程",
    icon: "/images/projectZomboid/icon.webp",
    qq: null,
    support: [
      "正版和盗版都支持，但如果卡Steam验证问题需要自己去解决",
      "该游戏只有PC端，别问手机能不能玩了",
    ],
  },
  {
    path: "/docs/juicyRealm",
    title: "恶果之地",
    icon: "/images/juicyRealm/icon.webp",
    qq: "981282876",
    support: ["支持安卓、苹果、电脑三端跨平台联机（需要游戏版本一致）"],
  },
  {
    path: "/docs/aresVirus2",
    title: "阿瑞斯病毒2",
    icon: "/images/aresVirus2/icon.webp",
    qq: "966579113",
    support: ["支持安卓、苹果、电脑三端跨平台联机（需要游戏版本一致）"],
  },
];

// 抽取角色常量
const ROLE_HOSTER = "hoster";
const ROLE_NONE = "none";
const GENERAL_QQ_GROUP = "1047464328";
const GENERAL_QQ_GROUP_LINK = "https://qm.qq.com/q/HxnUVAdRa8";

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
    serverData,
  } = useUserStateStore();

  const [carouselIndex, setCarouselIndex] = useState(0);

  // 轮播效果：每6秒更换一条消息
  useEffect(() => {
    const interval = setInterval(() => {
      if (serverData?.carouselMsg)
        setCarouselIndex(
          (prevIndex) => (prevIndex + 1) % serverData.carouselMsg.length,
        );
    }, 6000);

    // 清理定时器
    return () => clearInterval(interval);
  }, [serverData?.carouselMsg]);

  useEffect(() => {
    // 当节点存在，且还没有房间数据时，自动拉取
    if (userWgInfo?.node_alias && roomData === undefined) {
      getRoomData();
    }
  }, [userWgInfo?.node_alias, roomData, getRoomData]);

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

        // 数据异常就刷新
        if (data.code === -1) window.location.reload();

        // 房间操作后滚动到页面顶部
        if (data.code === 0) window.scrollTo(0, 0);

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
          value: getRoomGameName(game),
        });
        if (data.code === 0) {
          setSelectedGame(game ?? null);
          getRoomData();
        } else {
          if (data.msg.includes("赞助")) {
            setSponsorNotice(data.msg);
            openSponsorNotice();
            return;
          }

          if (isOnline && data.msg.includes("再加入")) {
            getRoomData();
          }
          openToast({ content: data.msg, status: "warning" });
        }
      } catch (err) {
        openToast({ content: String(err), status: "error" });
      }
    },
    [requestRoomApi, getRoomData, isOnline, openSponsorNotice],
  );

  // 关闭房间（房主）
  const handleCloseRoom = useCallback(async () => {
    try {
      const data = await requestRoomApi("handleRoom", {
        handleType: "closeRoom",
        value: "",
      });
      if (data.code === 0) {
        setSelectedGame(null);
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
        setSelectedGame(null);
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
          setSelectedGame(null);
          getRoomData();
          setHideJoinPassInput(true);
          setInputRoomId("");
          setInputPasswd("");
        } else {
          if (data.msg.includes("密码")) {
            setHideJoinPassInput(false);
          }
          if (isOnline && data.msg.includes("再加入")) {
            getRoomData();
          }
          openToast({ content: data.msg, status: "warning" });
        }
      } catch (err) {
        openToast({ content: `请求出错: ${String(err)}`, status: "error" });
      }
    },
    [requestRoomApi, getRoomData, isOnline],
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
    }
    // else if (netType === "境外") {
    //   return "你选的是境外线路节点，只建议中国大陆外的用户使用";
    // }
    return null;
  }, [userWgInfo?.net_type]);

  const nodeWarningElement = useMemo(() => {
    if (!nodeWarningText) return null;
    return (
      <Text
        maxW="300px"
        color="#ffca3d"
        fontSize="sm"
        textAlign="center"
        mx={5}
      >
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

  // 待加入页面（未进房间）
  const standbyPage = () => (
    <Box textAlign="center" w="320px">
      <VStack spacing={1}>
        <Button
          size={isOnline ? "xs" : "sm"}
          fontSize={isOnline ? "xs" : "md"}
          my={2}
          onClick={() => {
            navigate("/docs");
          }}
        >
          WG安装部署教程
        </Button>

        <Modal
          isOpen={gameInfo !== null}
          onClose={() => setGameInfo(null)}
          isCentered
        >
          <ModalOverlay />
          <ModalContent bgColor="#002f5c" mx={4}>
            <ModalHeader>{gameInfo?.title}</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              {gameInfo?.qq ? (
                <Text mb={4}>该游戏的喵服QQ群 {gameInfo.qq}</Text>
              ) : (
                <Text mb={4}>
                  {gameInfo?.title !== "通用联机房" ? (
                    <>
                      暂无该游戏的喵服关联群，有问题请加大群：
                      <Link
                        ml={1}
                        href={GENERAL_QQ_GROUP_LINK}
                        target="_blank"
                        color="#7dd4ff"
                      >
                        {GENERAL_QQ_GROUP}
                      </Link>
                    </>
                  ) : (
                    <Text>喵服联机大群 {GENERAL_QQ_GROUP}</Text>
                  )}
                </Text>
              )}

              <Text mb={2} fontWeight="bold" color="#a8d1ff">
                联机支持情况
              </Text>
              {gameInfo?.support && gameInfo.support.length > 0 ? (
                <VStack align="stretch" spacing={2}>
                  {gameInfo.support.map((item) => (
                    <Text key={item}>• {item}</Text>
                  ))}
                </VStack>
              ) : (
                <Text color="gray.300">
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
          <ModalContent bgColor="#202e4f" color="white" mx={4}>
            <ModalBody>
              <Text mt={3}>{sponsorNotice}</Text>
              <Text>注：仅需房主赞助</Text>
            </ModalBody>
            <ModalFooter gap={3}>
              <Button bgColor="transparent" onClick={closeSponsorNotice}>
                稍后再说
              </Button>
              <Button
                colorScheme="orange"
                onClick={() => {
                  closeSponsorNotice();
                  navigate("/sponsor");
                }}
              >
                前往赞助页面
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Box borderRadius="lg" w="100%" overflow="hidden">
          <Flex
            align="center"
            justify="space-between"
            px={3}
            py={3}
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
              px={3}
              py={3}
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
          w="100%"
          mb={{ md: 10, base: 0 }}
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
                  <Box ml={3} minW={0} textAlign="left">
                    <Text
                      fontSize="md"
                      fontWeight="bold"
                      color="white"
                      isTruncated
                    >
                      {game.title}
                    </Text>
                    <Button
                      variant="link"
                      bg="transparent"
                      color="#7dd4ff"
                      fontSize="sm"
                      fontWeight="normal"
                      onClick={() => setGameInfo(game)}
                    >
                      查看联机支持情况
                    </Button>
                  </Box>
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
    <Box textAlign="center" mt={1}>
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
        {roomGame && (
          <VStack spacing={3} justify="center" wrap="wrap" my={1}>
            <Button
              size={isOnline ? "xs" : "sm"}
              fontSize={isOnline ? "xs" : "md"}
              onClick={() => navigate("/docs")}
            >
              WG安装部署教程
            </Button>

            <Button
              size={isOnline ? "sm" : "xs"}
              fontSize={isOnline ? "md" : "sm"}
              onClick={() => navigate(roomGame.path)}
              pl={isOnline ? 0 : 2}
              pr={2}
            >
              <Image
                ml={2}
                mr={1}
                src={roomGame.icon}
                alt={roomGame.title}
                h="1.6em"
                w="1.6em"
                objectFit="cover"
                borderRadius="md"
                flexShrink={0}
                display={isOnline ? "inline" : "none"}
              />

              {roomGame.title === "通用联机房"
                ? `通用游戏联机教程`
                : `${roomGame.title} 联机教程`}
            </Button>
          </VStack>
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
              {item.ip === userWgInfo?.user_ip && (
                <Tag colorScheme="blue" fontWeight="bold" size="md">
                  你
                </Tag>
              )}
              <Text fontWeight="bold" fontSize="1.1rem" ml={2} color="white">
                {item.username}
              </Text>

              <Tag
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

      {roomRole === ROLE_HOSTER && roomData && roomData?.room_max === 2 && (
        <Text fontSize="md" color="#ffca3d">
          如需增加房间人数请叠加赞助金额
        </Text>
      )}
    </Box>
  );

  return (
    <Flex direction="column" px={{ base: 4, md: 8 }} align="center">
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
          <Text color="#ffca3d" mb={2} fontWeight="bold">
            {serverData?.carouselMsg && serverData?.carouselMsg[carouselIndex]}
          </Text>

          {userWgInfo?.node_alias && roomData !== undefined ? (
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
                  onClick={setNodeListModal}
                  size="sm"
                  color="white"
                  fontWeight="medium"
                  px={3}
                  flexShrink={0}
                >
                  切换节点
                </Button>
              </Flex>

              <Flex align="center" gap={2}>
                <Text
                  fontSize={18}
                  fontWeight="bold"
                  color={getStatusColor(isOnline)}
                >
                  {isOnline ? "WG在线" : "WG离线"}
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
          ) : (
            <Center my={2}>
              节点数据加载中
              <Spinner size="md" />
            </Center>
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
            <Text color="#ffca3d" textAlign="center">
              WG隧道打开还是未连接？
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

          {roomRole === ROLE_NONE ? standbyPage() : joinedPage()}
        </>
      )}
    </Flex>
  );
}
