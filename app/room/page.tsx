"use client";

import { useEffect, useState, useCallback } from "react";
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
import { useRouter } from "next/navigation";
import { NoticeText } from "@/components/universal/Notice";
import AnnouncementsModal from "@/components/docs/Announcement";
import SponsorTag from "@/components/universal/SponsorTag";
import OfflineReasons from "@/components/docs/OfflineReasons";

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

interface HandleRoomResponse {
  code: number;
  msg: string;
  [key: string]: any;
}

// 轮播消息数组
const carouselMessages = [
  "关闭浏览器不影响联机，WG不关即可",
  "联机时使用该页面上显示的联机IP",
  "房间里任意玩家都可以当主机",
];

const carouselMessagesVip = [
  "关闭浏览器不影响联机，WG不关即可",
  "联机时使用该页面上显示的联机IP",
  "房间里任意玩家都可以当主机",
];

export default function Page() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const {
    isOpen: joinIsOpen,
    onOpen: joinOnOpen,
    onClose: joinOnClose,
  } = useDisclosure();

  const {
    isOpen: setPassIsOpen,
    onOpen: setPassOnOpen,
    onClose: setPassOnClose,
  } = useDisclosure();

  const [hideJoinPassInput, setHideJoinPassInput] = useState(true);

  const [inputRoomId, setInputRoomId] = useState("");
  const [inputPasswd, setInputPasswd] = useState("");
  const {
    userInfo,
    userNodeInfo,
    roomData,
    getRoomData,
    setRoomData,
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
    if (userNodeInfo?.node_alias) {
      getRoomData();
    }
  }, [userNodeInfo?.node_alias, getRoomData]);

  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIndex(
        (prevIndex) => (prevIndex + 1) % carouselMessages.length,
      );
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  // 通用请求函数，自动管理 loading 和错误处理
  const requestRoomApi = useCallback(
    async (
      endpoint: string,
      params: Record<string, string> = {},
    ): Promise<HandleRoomResponse> => {
      if (loading) {
        throw new Error("请不要点太快");
      }
      setLoading(true);

      try {
        const urlParams = new URLSearchParams(params);
        const url = `${
          process.env.NEXT_PUBLIC_API_URL
        }/${endpoint}?${urlParams.toString()}`;

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
        setLoading(false);
      }
    },
    [loading],
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
            setRoomData({
              ...roomData,
              room_passwd: newPasswd,
            });
          }
          openToast({ content: data.msg, status: "success" });
          if (setPassIsOpen) setPassOnClose();
        } else {
          openToast({ content: data.msg, status: "warning" });
        }
      } catch (err) {
        openToast({ content: String(err), status: "error" });
      }
    },
    [requestRoomApi, roomData, setRoomData, setPassIsOpen, setPassOnClose],
  );

  // 创建房间
  const handleCreateRoom = useCallback(async () => {
    try {
      const data = await requestRoomApi("handleRoom", {
        handleType: "createRoom",
        value: "",
      });
      if (data.code === 0) {
        getRoomData();
      } else {
        openToast({ content: data.msg, status: "warning" });
      }
    } catch (err) {
      openToast({ content: String(err), status: "error" });
    }
  }, [requestRoomApi, getRoomData]);

  // 关闭房间
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
          joinOnClose();
        } else {
          if (data.msg === "加入该房间需要密码") {
            setHideJoinPassInput(false);
          }
          openToast({ content: data.msg, status: "warning" });
        }
      } catch (err) {
        openToast({ content: `请求出错: ${String(err)}`, status: "error" });
      }
    },
    [requestRoomApi, getRoomData, joinOnClose, setHideJoinPassInput],
  );

  // 退出房间
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

  // 删除成员
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

  function standbyPage() {
    return (
      <Box textAlign="center">
        <Modal isOpen={joinIsOpen} onClose={joinOnClose}>
          <ModalOverlay />
          <ModalContent bgColor="#002f5c">
            <ModalHeader>加入房间</ModalHeader>

            <ModalCloseButton />

            <ModalBody onKeyDown={handleJoinRoomEnter}>
              <Input
                type="text"
                placeholder="请输入房间号"
                value={inputRoomId}
                onChange={(e) => {
                  setInputRoomId(e.target.value);
                  setHideJoinPassInput(true);
                }}
              />

              <Input
                mt={3}
                type="text"
                placeholder="请输入房间密码"
                value={inputPasswd}
                onChange={(e) => {
                  setInputPasswd(e.target.value);
                }}
                hidden={hideJoinPassInput}
              />
            </ModalBody>

            <ModalFooter>
              <Button
                bgColor="#007bc0"
                onClick={() => {
                  handleJoinRoom(inputRoomId, inputPasswd);
                }}
              >
                加入
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <VStack spacing={6} mt={3}>
          <Button
            h="50px"
            fontSize="25px"
            onClick={() => {
              handleCreateRoom();
            }}
          >
            创建房间
          </Button>

          <Button
            h="50px"
            fontSize="25px"
            onClick={() => {
              joinOnOpen();
              setHideJoinPassInput(true);
              setInputRoomId("");
              setInputPasswd("");
            }}
          >
            加入房间
          </Button>
        </VStack>
      </Box>
    );
  }

  function joinedPage() {
    return (
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
          {/* {roomRole === "hoster" && (
            <HStack justify="center" spacing={0} mt={2}>
              <Text fontWeight="bold">允许直接加入</Text>
              {roomData?.room_passwd ? <FaTimes /> : <FaCheck />}

              <Switch
                px={2}
                size="md"
                colorScheme="green"
                isChecked={roomData?.room_passwd ? false : true}
                onChange={() => {
                  // 已设置密码就清空密码
                  if (roomData?.room_passwd) {
                    setInputPasswd("");
                    handleSetRoomPasswd("");
                  } else {
                    setInputPasswd(
                      roomData?.room_passwd ? roomData?.room_passwd : "",
                    );
                    setPassOnOpen();
                  }
                }}
              />

              <Button
                variant="link"
                bg="transparent"
                hidden={roomData?.room_passwd ? false : true}
                onClick={() => {
                  setInputPasswd(
                    roomData?.room_passwd ? roomData?.room_passwd : "",
                  );
                  setPassOnOpen();
                }}
                isDisabled={roomData?.room_passwd ? false : true}
              >
                <Text>查看房间密码</Text>
              </Button>
            </HStack>
          )} */}

          {roomData?.members.map((item, index) => (
            <Box
              w="300px"
              key={item.ip}
              bg="rgb(75 127 187 / 38%)"
              p={1}
              borderRadius={12}
              borderColor={item.ip === userNodeInfo?.user_ip ? "#6db4ff" : "transparent"}
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
                >
                  联机ip {item.ip}
                </Tag>

                {item.sponsorship > 0 && (
                  <SponsorTag amount={item.sponsorship} />
                )}

                {roomRole === "hoster" && item.ip !== roomData.hoster_ip && (
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
        </VStack>

        <HStack justify="center">
          <Button
            px={0}
            size="lg"
            bg="transparent"
            onClick={roomRole === "hoster" ? handleCloseRoom : handleExitRoom}
          >
            {roomRole === "hoster" ? "关闭房间" : "退出房间"}
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

        {roomData?.room_max && roomData.room_max < 8 && (
          <Text fontSize="sm" color="#ffca3d">
            房间最大人数计算请看赞助页面说明
          </Text>
        )}
      </Box>
    );
  }

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
          {userNodeInfo?.node_alias && (
            <Flex
              align="center"
              justify="space-between"
              borderRadius="md"
              boxShadow="sm"
              mb={1}
              bg="rgba(75, 127, 187, 0.38)"
              p={3}
              w="100%"
              maxW="300px"
            >
              <Flex direction="column" flex="1" mr={3}>
                <Flex align="center" mb={1}>
                  {nodeNetLoad !== -1 ? (
                    <Text fontWeight="medium" fontSize="sm">
                      负载
                      <Text
                        as="span"
                        ml={1}
                        fontWeight="bold"
                        color={getNetColor(nodeNetLoad)}
                      >
                        {getNetText(nodeNetLoad)}
                      </Text>
                    </Text>
                  ) : (
                    <Text fontWeight="bold" fontSize="md" color="#ff5333">
                      节点故障
                    </Text>
                  )}

                  <Text as="span" fontWeight="bold" mx="auto">
                    {userNodeInfo?.node_alias}
                  </Text>
                </Flex>

                {nodeNetLoad !== -1 && (
                  <Box
                    w="100%"
                    h="6px"
                    bg="rgba(255, 255, 255, 0.2)"
                    borderRadius="full"
                    overflow="hidden"
                  >
                    <Box
                      w={`${Math.min(nodeNetLoad, 100)}%`}
                      h="100%"
                      bg={getNetColor(nodeNetLoad)}
                      borderRadius="full"
                      transition="width 0.3s ease"
                    />
                  </Box>
                )}
              </Flex>
              <Button
                rounded="md"
                onClick={setNodeListModal}
                size="sm"
                bgColor="#007bc0"
                _hover={{ bgColor: "#005a9e" }}
                color="white"
              >
                切换节点
              </Button>
            </Flex>
          )}

          <OfflineReasons />

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
              <Box animation={rotate ? `${spin} 1s linear infinite` : "none"}>
                <TbReload size={18} />
              </Box>
            </Button>
          </Flex>

          {roomRole !== "none" && (
            <Text fontSize={18} fontWeight="bold" mr={3}>
              <Text
                as="span"
                onClick={() => {
                  if (roomData?.room_id) copyText(roomData.room_id.toString());
                }}
              >
                房间号&ensp;{roomData?.room_id}
              </Text>
              {roomRole === "hoster" && (
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

          {/* {isOnline &&
            roomData?.members.length === 1 &&
            roomRole === "hoster" && (
              <Text color="#ffca3d" size="sm" textAlign="center">
                联机的玩家都要注册喵服账号并安装WG
              </Text>
            )} */}

          {isOnline === false && (
            <Text color="#ffca3d" size="sm" textAlign="center" mb={2}>
              WG下载和联机教程👉
              <Button
                variant="link"
                bg="transparent"
                color="#7dd4ff"
                onClick={() => {
                  router.push(`/docs`);
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
            roomRole !== "none" &&
            (userInfo?.sponsorship > 10
              ? carouselMessagesVip[carouselIndex]
              : carouselMessages[carouselIndex])}

          {isOnline && (
            <Text size="sm" textAlign="center" mb={2}>
              复习联机教程
              <Button
                variant="link"
                bg="transparent"
                color="#7dd4ff"
                onClick={() => {
                  router.push(`/docs`);
                  //#games
                }}
              >
                👉点我查看
              </Button>
            </Text>
          )}

          {roomRole === "none" ? standbyPage() : joinedPage()}
        </>
      )}
    </Flex>
  );
}
