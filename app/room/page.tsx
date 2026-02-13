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
  Switch,
  Tag,
  useColorModeValue,
  List,
  ListItem,
  ListIcon,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { openToast } from "@/components/universal/toast";
import { Button } from "@/components/universal/button";
import { IoReloadCircle } from "react-icons/io5";
import { GiNetworkBars } from "react-icons/gi";
import { TbReload } from "react-icons/tb";
import { useUserStateStore } from "@/store/user-state";
import { getAuthToken } from "@/store/authKey";
import { copyText, isInteger } from "@/utils/strings";
import { IoIosExit } from "react-icons/io";
import { FaCheck, FaTimes } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { NoticeText } from "@/components/universal/Notice";
import AnnouncementsModal from "@/components/docs/Announcement";
import SponsorTag from "@/components/universal/SponsorTag";
import { MdTipsAndUpdates } from "react-icons/md";

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

interface HandleRoomResponse {
  code: number;
  msg: string;
  [key: string]: any;
}

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

  const {
    isOpen: setNoticeIsOpen,
    onOpen: setNoticeOnOpen,
    onClose: setNoticeOnClose,
  } = useDisclosure();

  const [hideJoinPassInput, setHideJoinPassInput] = useState(true);

  const [inputRoomId, setInputRoomId] = useState("");
  const [inputPasswd, setInputPasswd] = useState("");
  const {
    userInfo,
    roomData,
    getRoomData,
    setRoomData,
    roomRole,
    latency,
    getTunnel,
    onlineStatus,
    rotate,
    disableFlush,
    setShowLoginModal,
    setNodeListModal,
    tunnelName,
  } = useUserStateStore();

  useEffect(() => {
    if (userInfo?.wg_data?.node_alias) {
      getRoomData();
    }
  }, [userInfo?.wg_data?.node_alias, getRoomData]);

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

  function getColor(latency: number) {
    if (latency > 100) return "#ffa524";
    else if (latency > 0) return "#3fdb1d";
    else return "#ff3b3b";
  }

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

  const OfflineReasons = [
    `隧道名称是否为${tunnelName}，如果不是，到联机教程导入正确隧道`,
    "导入的隧道必须是自己账号的！不能用其他人给的conf_key/二维码/隧道文件",
    "特殊区域（如学校、公司）的网络会拦截WG流量，试试流量上网可进行验证",
    "如果跨境联机请使用跨境线路的节点，如香港A节点",
    "部分国家无法直接连接喵服（目前已知俄罗斯不行），这种情况需要找服主特殊处理"
  ];

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

        <Heading mb={5}>请选择操作</Heading>

        <VStack spacing={6} alignItems="center">
          <Button h="50px" fontSize="25px" onClick={handleCreateRoom}>
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
            <ModalHeader>设置房间密码</ModalHeader>

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
              <Button
                bgColor="#007bc0"
                onClick={() => handleSetRoomPasswd(inputPasswd)}
              >
                更新密码
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <VStack>
          {roomRole === "hoster" && (
            <HStack justify="center" spacing={0}>
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
          )}

          {roomData?.members.map((item, index) => (
            <Box
              w="300px"
              key={item.ip}
              bg="rgb(75 127 187 / 38%)"
              p={1}
              borderRadius={12}
              borderColor={
                item.ip === userInfo?.wg_data?.ip ? "#6db4ff" : "transparent"
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
                  color={item.status === "在线" ? "#3fdb1d" : "#ff4444"}
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
            {roomData?.members.length}/8
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
      </Box>
    );
  }

  return (
    <Flex direction="column" px={{ base: 4, md: 8 }} align="center">
      <AnnouncementsModal />

      {!userInfo ? (
        <>
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
        </>
      ) : !userInfo?.wg_data ? (
        <>
          <Heading size="md" color="#ffa629">
            你还没获取隧道呢
          </Heading>

          <Button rounded={5} onClick={getTunnel} bgColor="#007bc0" size="sm">
            点击获取隧道
          </Button>
        </>
      ) : (
        <>
          {userInfo?.wg_data?.node_alias ? (
            <Flex
              align="center"
              justify="space-between"
              borderRadius="md"
              boxShadow="sm"
            >
              <Text fontWeight="medium" fontSize="md" mr={2}>
                当前联机节点：
                <Text as="span" fontWeight="bold">
                  {userInfo?.wg_data?.node_alias}
                </Text>
              </Text>
              <Button rounded="md" onClick={setNodeListModal} size="sm">
                切换
              </Button>
            </Flex>
          ) : (
            <Button rounded="md" onClick={setNodeListModal}>
              选择联机节点
            </Button>
          )}

          {onlineStatus === "离线" ? (
            <Text color="#ffca3d" size="sm">
              离线无法联机！需要安装WG客户端
              <br />
              WG客户端下载和教程👉
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
              隧道已连接但还是离线👉
              <Button
                variant="link"
                bg="transparent"
                color="#7dd4ff"
                onClick={setNoticeOnOpen}
              >
                点我排查
              </Button>
            </Text>
          ) : (
            <Text color="#ffca3d" size="sm">
              已在线但游戏联机失败
              <Button
                variant="link"
                bg="transparent"
                color="#7dd4ff"
                onClick={() => {
                  router.push(`/docs#games`);
                }}
              >
                👉点我点我
              </Button>
            </Text>
          )}

          {/* 连接失败原因Modal */}
          <Modal isOpen={setNoticeIsOpen} onClose={setNoticeOnClose}>
            <ModalOverlay />
            <ModalContent bg="#202e4fe0" color="white" mx={5} py={5}>
              <ModalHeader>
                <Heading size="lg">自行逐项检查</Heading>
              </ModalHeader>
              <ModalCloseButton />

              <ModalBody>
                <VStack align="start" spacing={3}>
                  <List spacing={5}>
                    {OfflineReasons.map((reason, index) => (
                      <ListItem key={index} textAlign="left">
                        <ListIcon as={MdTipsAndUpdates} />
                        {reason}
                      </ListItem>
                    ))}
                  </List>
                </VStack>
              </ModalBody>
            </ModalContent>
          </Modal>

          <Flex align="center" my={3}>
            {roomRole !== "none" && (
              <Text fontSize={18} fontWeight="bold" mr={3}>
                房间号 {roomData?.room_id}
              </Text>
            )}

            <Text
              fontSize={18}
              p={0}
              mr={1}
              fontWeight="bold"
              color={onlineStatus === "在线" ? "#3fdb1d" : "#ff0000"}
            >
              {onlineStatus === "离线" ? "WG离线" : "在线"}
            </Text>
            {onlineStatus === "在线" && latency && (
              <Flex align="center">
                <GiNetworkBars size={20} color={getColor(latency)} />
                <Box ml={1}>{latency}ms</Box>
              </Flex>
            )}
            <Button
              bg="transparent"
              h={5}
              px={0}
              disabled={disableFlush}
              onClick={() => {
                getRoomData(false);
              }}
            >
              <Text fontSize={18} fontWeight="normal" color="#3fdb1d" ml={2}>
                刷新
              </Text>
              <Box animation={rotate ? `${spin} 1s linear infinite` : "none"}>
                <TbReload size={18} />
              </Box>
            </Button>
          </Flex>

          {roomRole === "none" ? standbyPage() : joinedPage()}
        </>
      )}
    </Flex>
  );
}
