"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Box,
  Text,
  Input,
  Modal,
  ModalOverlay,
  Heading,
  Center,
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
import { PiCoffeeBold } from "react-icons/pi";
import { useRouter } from "next/navigation";
import { NoticeText } from "@/components/universal/Notice";
import SponsorAd from "@/components/docs/AD";
import SponsorTag from "@/components/universal/SponsorTag";

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

interface HandleRoomResponse {
  code: number;
  msg: string;
}

export default function Page() {
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [tutorialColor, setTutorialColor] = useState(true);

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

  const [docButtonText, setDocButtonText] = useState("点我查看使用教程");
  const [inputRoomId, setInputRoomId] = useState("");
  const [inputPasswd, setInputPasswd] = useState("");
  const {
    logined,
    userInfo,
    roomData,
    getRoomData,
    setRoomData,
    roomStatus,
    latency,
    getIp,
    onlineStatus,
    rotate,
    disableFlush,
    setShowLoginModal,
    setNodeListModal,
  } = useUserStateStore();

  useEffect(() => {
    if (logined && userInfo?.wg_data?.node_alias) {
      getRoomData();
    }
  }, [logined, userInfo?.wg_data?.node_alias, getRoomData]);

  // 离线的时候闪烁
  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;

    if (onlineStatus === "离线") {
      setDocButtonText("点我查看使用教程");
      // \n不看文档当然离线
      intervalId = setInterval(() => {
        setTutorialColor((prev) => !prev);
      }, 300);
    } else {
      setDocButtonText("点我查看使用教程");
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [onlineStatus]);

  // 60秒检测一次
  // useEffect(() => {
  //   let intervalId: NodeJS.Timeout | undefined;

  //   intervalId = setInterval(() => {
  //     getLatency();
  //   }, 60000);

  //   return () => {
  //     if (intervalId) {
  //       clearInterval(intervalId);
  //     }
  //   };
  // }, []);

  // 设置房间密码
  const handleSetRoomPasswd = useCallback(
    async (newPasswd: string) => {
      try {
        if (loading === true) {
          throw new Error(`请不要点太快`);
        }

        setLoading(true);
        const resp = await fetch(
          `${apiUrl}/setRoomPasswd?roomPasswd=${newPasswd}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${getAuthToken()}`,
            },
          }
        );
        setLoading(false);
        if (!resp.ok) {
          throw new Error(`访问接口出错: ${resp.status}`);
        }

        const data = await resp.json();
        if (data.code === 0) {
          if (roomData)
            setRoomData({
              ...roomData,
              room_passwd: newPasswd,
            });

          openToast({ content: data.msg, status: "success" });
        } else {
          openToast({ content: data.msg, status: "warning" });
        }
        if (setPassIsOpen) setPassOnClose();
      } catch (err) {
        openToast({ content: String(err), status: "error" });
      }
    },
    [apiUrl, loading, roomData, setPassIsOpen, setPassOnClose, setRoomData]
  );

  // 发送房间操作请求
  const handleRoomFetch = useCallback(
    async (
      handleType: string,
      handleValue: string,
      roomPasswd: string = ""
    ): Promise<HandleRoomResponse> => {
      if (loading === true) {
        throw new Error(`请不要点太快`);
      }
      setLoading(true);
      const resp = await fetch(
        `${apiUrl}/handleRoom?handleType=${handleType}&value=${handleValue}&roomPasswd=${roomPasswd}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );
      setLoading(false);
      if (!resp.ok) {
        throw new Error(`访问接口出错: ${resp.status}`);
      }

      const data: HandleRoomResponse = await resp.json();

      if (data.code === -1) {
        // ip失效刷新页面
        window.location.reload();
      }
      return data;
    },
    [apiUrl, loading]
  );

  // 创建房间
  const handleCreateRoom = async () => {
    try {
      const data = await handleRoomFetch("createRoom", "");
      if (data.code === 0) {
        getRoomData();
      } else {
        openToast({ content: data.msg, status: "success" });
      }
    } catch (err) {
      openToast({ content: String(err), status: "error" });
    }
  };

  // 关闭房间
  const handleCloseRoom = async () => {
    try {
      const data = await handleRoomFetch("closeRoom", "");
      if (data.code === 0) {
        getRoomData();
      } else {
        openToast({ content: data.msg, status: "error" });
      }
    } catch (err) {
      openToast({ content: `请求出错: ${String(err)}`, status: "error" });
    }
  };

  // 加入房间
  const handleJoinRoom = async (roomId: string, passwd: string) => {
    if (!roomId) {
      return;
    }

    if (!isInteger(roomId)) {
      openToast({
        content: "房间号是串数字，不知道就问房主",
        status: "warning",
      });
      return;
    }

    try {
      const data = await handleRoomFetch("joinRoom", roomId, passwd);
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
  };

  // 退出房间
  const handleExitRoom = async () => {
    try {
      const data = await handleRoomFetch("exitRoom", "");
      if (data.code === 0) {
        getRoomData();
      } else {
        openToast({ content: data.msg, status: "error" });
      }
    } catch (err) {
      openToast({ content: `请求出错: ${String(err)}`, status: "error" });
    }
  };

  // 删除成员
  const handleDelMember = async (delIp: string) => {
    try {
      const data = await handleRoomFetch("delMember", delIp);
      if (data.code === 0) {
        getRoomData();
      } else {
        openToast({ content: data.msg, status: "error" });
      }
    } catch (err) {
      openToast({ content: `请求出错: ${String(err)}`, status: "error" });
    }
  };

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
          {roomStatus === "hoster" && (
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
                      roomData?.room_passwd ? roomData?.room_passwd : ""
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
                    roomData?.room_passwd ? roomData?.room_passwd : ""
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

                  {item.sponsorship > 0 && (
                    <SponsorTag amount={item.sponsorship} />
                  )}
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

                {roomStatus === "hoster" && item.ip !== roomData.hoster_ip && (
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
            onClick={roomStatus === "hoster" ? handleCloseRoom : handleExitRoom}
          >
            {roomStatus === "hoster" ? "关闭房间" : "退出房间"}
            <IoIosExit size={30} color="#ff4444" />
          </Button>

          <Text fontSize="lg" fontWeight="bold" ml={2} mr={3}>
            {roomData?.members.length}/8
          </Text>

          <Button
            px={0}
            size="lg"
            bg="transparent"
            // isDisabled={disableFlush}
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
    <VStack spacing={3} alignItems="center">
      <SponsorAd />

      {!logined ? (
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

          <Button rounded={5} onClick={getIp} bgColor="#007bc0" size="sm">
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

          <Button
            whiteSpace="pre-wrap"
            // variant="link"
            // bg="transparent"
            bg="#2976bd"
            size="md"
            onClick={() => {
              onlineStatus === "在线"
                ? router.push(`/docs#games`)
                : router.push(`/docs`);
            }}
            color={
              onlineStatus === "在线"
                ? "white"
                : tutorialColor
                ? "#ff0000"
                : "white"
            }
          >
            {docButtonText}
          </Button>

          <Flex align="center">
            {roomStatus !== "none" && (
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
              {onlineStatus}
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
          {roomStatus === "none" ? standbyPage() : joinedPage()}
          {/* <Box
            textAlign="center"
            position="fixed"
            left="12px"
            bottom="30vh"
            onClick={() => {
              router.push(`/sponsor`);
            }}
            zIndex={100}
          >
            <Box boxSize={{ base: "8", md: "10" }}>
              <PiCoffeeBold size="100%" />
            </Box>
            <Text fontSize="sm">赞助</Text>
          </Box> */}
        </>
      )}
    </VStack>
  );
}
