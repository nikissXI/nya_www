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
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "";

  // 状态管理
  const [tutorialColor, setTutorialColor] = useState(true);
  const [loading, setLoading] = useState(false);
  const [disableCheckNet, setDisableCheckNet] = useState(false);
  const [disableGetRoom, setDisableGetRoom] = useState(false);
  const [hideJoinPassInput, setHideJoinPassInput] = useState(true);
  const [inputWgnum, setInputWgnum] = useState("");
  const [inputPasswd, setInputPasswd] = useState("");

  const {
    logined,
    userInfo,
    roomData,
    getRoomData,
    setRoomData,
    roomStatus,
    latency,
    getLatency,
    getWgnum,
    onlineStatus,
    rotate,
    setShowLoginModal,
  } = useUserStateStore();

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

  // 更新房间成员在线状态
  const updateRoomMemberStatus = useCallback(
    (status: "在线" | "离线") => {
      if (roomData && userInfo?.wg_data) {
        setRoomData({
          ...roomData,
          members: roomData.members.map((member) =>
            member.wgnum === userInfo.wg_data?.wgnum
              ? { ...member, status }
              : member
          ),
        });
      }
    },
    [roomData, userInfo, setRoomData]
  );

  // 离线时闪烁提醒
  useEffect(() => {
    if (onlineStatus === "离线") {
      const intervalId = setInterval(
        () => setTutorialColor((prev) => !prev),
        300
      );
      return () => clearInterval(intervalId);
    }
    setTutorialColor(true);
  }, [onlineStatus]);

  // 初始化获取延迟和房间数据
  useEffect(() => {
    if (latency === undefined) getLatency();
  }, [latency, getLatency]);

  useEffect(() => {
    if (roomData === undefined) getRoomData();
  }, [roomData, getRoomData]);

  // 60秒自动检测延迟
  useEffect(() => {
    const intervalId = setInterval(() => getLatency(), 60000);
    return () => clearInterval(intervalId);
  }, [getLatency]);

  // 通用请求封装，处理loading状态和错误提示
  const fetchWithLoading = useCallback(
    async <T,>(url: string, options?: RequestInit): Promise<T> => {
      if (loading) throw new Error("请不要点太快");
      setLoading(true);
      try {
        const resp = await fetch(url, options);
        if (!resp.ok) throw new Error(`访问接口出错: ${resp.status}`);
        const data = await resp.json();
        return data as T;
      } finally {
        setLoading(false);
      }
    },
    [loading]
  );

  // 设置房间密码
  const handleSetRoomPasswd = useCallback(
    async (newPasswd: string) => {
      try {
        const data = await fetchWithLoading<HandleRoomResponse>(
          `${apiUrl}/setRoomPasswd?roomPasswd=${encodeURIComponent(newPasswd)}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${getAuthToken()}` },
          }
        );
        if (data.code === 0) {
          if (roomData) setRoomData({ ...roomData, room_passwd: newPasswd });
          openToast({ content: data.msg, status: "success" });
          setPassOnClose();
        } else {
          openToast({ content: data.msg, status: "warning" });
        }
      } catch (err) {
        openToast({ content: String(err), status: "error" });
      }
    },
    [apiUrl, fetchWithLoading, roomData, setRoomData, setPassOnClose]
  );

  // 房间操作请求
  const handleRoomFetch = useCallback(
    async (
      handleType: string,
      handleWgnum: number,
      roomPasswd = ""
    ): Promise<HandleRoomResponse> => {
      const url = `${apiUrl}/handleRoom?handleType=${encodeURIComponent(
        handleType
      )}&wgnum=${handleWgnum}&roomPasswd=${encodeURIComponent(roomPasswd)}`;
      const data = await fetchWithLoading<HandleRoomResponse>(url, {
        method: "GET",
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      });

      if (data.code === -1) {
        window.location.reload();
      }
      return data;
    },
    [apiUrl, fetchWithLoading]
  );

  // 业务操作封装
  const handleCreateRoom = useCallback(async () => {
    try {
      const data = await handleRoomFetch("createRoom", 0);
      if (data.code === 0) {
        getRoomData();
      } else {
        openToast({ content: data.msg, status: "warning" });
      }
    } catch (err) {
      openToast({ content: String(err), status: "error" });
    }
  }, [handleRoomFetch, getRoomData]);

  const handleCloseRoom = useCallback(async () => {
    try {
      const data = await handleRoomFetch("closeRoom", 0);
      if (data.code === 0) {
        getRoomData();
      } else {
        openToast({ content: data.msg, status: "error" });
      }
    } catch (err) {
      openToast({ content: `请求出错: ${String(err)}`, status: "error" });
    }
  }, [handleRoomFetch, getRoomData]);

  const handleJoinRoom = useCallback(
    async (wgnum: string, passwd: string) => {
      if (!wgnum) return;

      if (!isInteger(wgnum)) {
        openToast({
          content: "房间号是整数，不知道就问房主",
          status: "warning",
        });
        return;
      }

      try {
        const data = await handleRoomFetch("joinRoom", Number(wgnum), passwd);
        if (data.code === 0) {
          getRoomData();
          joinOnClose();
        } else {
          if (data.msg === "加入该房间需要密码") setHideJoinPassInput(false);
          openToast({ content: data.msg, status: "warning" });
        }
      } catch (err) {
        openToast({ content: `请求出错: ${String(err)}`, status: "error" });
      }
    },
    [handleRoomFetch, getRoomData, joinOnClose]
  );

  const handleExitRoom = useCallback(async () => {
    try {
      const data = await handleRoomFetch("exitRoom", 0);
      if (data.code === 0) {
        getRoomData();
      } else {
        openToast({ content: data.msg, status: "error" });
      }
    } catch (err) {
      openToast({ content: `请求出错: ${String(err)}`, status: "error" });
    }
  }, [handleRoomFetch, getRoomData]);

  const handleDelMember = useCallback(
    async (delWgnum: number) => {
      try {
        const data = await handleRoomFetch("delMember", delWgnum);
        if (data.code === 0) {
          getRoomData();
        } else {
          openToast({ content: data.msg, status: "error" });
        }
      } catch (err) {
        openToast({ content: `请求出错: ${String(err)}`, status: "error" });
      }
    },
    [handleRoomFetch, getRoomData]
  );

  // 延迟颜色辅助
  const getColor = (latency: number) => {
    if (latency > 100) return "#ffa524";
    if (latency > 0) return "#3fdb1d";
    return "#ff3b3b";
  };

  // 回车事件处理简化
  const handleKeyPress =
    (handler: () => void) => (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Enter") {
        handler();
      }
    };

  // 未登录提示
  if (!logined) {
    return (
      <VStack spacing={3} align="center">
        <SponsorAd />
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
    );
  }

  // 未获取编号提示
  if (!userInfo?.wg_data) {
    return (
      <Center my={10}>
        <VStack spacing={3} mt={5} align="center">
          <Heading size="md" color="#ffa629">
            你还没联机编号呢
          </Heading>
          <Button rounded={5} onClick={getWgnum} bgColor="#007bc0" size="sm">
            点击获取编号
          </Button>
        </VStack>
      </Center>
    );
  }

  // 无房间页面
  const NonePage = () => (
    <Box textAlign="center">
      <Modal isOpen={joinIsOpen} onClose={joinOnClose}>
        <ModalOverlay />
        <ModalContent bgColor="#002f5c">
          <ModalHeader>加入房间</ModalHeader>
          <ModalCloseButton />
          <ModalBody
            onKeyDown={handleKeyPress(() =>
              handleJoinRoom(inputWgnum, inputPasswd)
            )}
          >
            <Input
              type="text"
              placeholder="请输入房间号"
              value={inputWgnum}
              onChange={(e) => {
                setInputWgnum(e.target.value);
                setHideJoinPassInput(true);
              }}
            />
            {!hideJoinPassInput && (
              <Input
                mt={3}
                type="text"
                placeholder="请输入房间密码"
                value={inputPasswd}
                onChange={(e) => setInputPasswd(e.target.value)}
              />
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              bgColor="#007bc0"
              onClick={() => handleJoinRoom(inputWgnum, inputPasswd)}
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
            setInputWgnum("");
            setInputPasswd("");
          }}
        >
          加入房间
        </Button>
      </VStack>
    </Box>
  );

  // 房间页面
  const RoomPage = () => (
    <Box textAlign="center">
      <Modal isOpen={setPassIsOpen} onClose={setPassOnClose}>
        <ModalOverlay />
        <ModalContent bgColor="#002f5c">
          <ModalHeader>设置房间密码</ModalHeader>
          <ModalCloseButton />
          <ModalBody
            onKeyDown={handleKeyPress(() => handleSetRoomPasswd(inputPasswd))}
          >
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

      <VStack spacing={3}>
        {roomStatus === "hoster" && (
          <HStack justify="center" spacing={2}>
            <Text fontWeight="bold">允许直接加入</Text>
            {roomData?.room_passwd ? <FaTimes /> : <FaCheck />}
            <Switch
              px={2}
              size="md"
              colorScheme="green"
              isChecked={!roomData?.room_passwd}
              onChange={() => {
                if (roomData?.room_passwd) {
                  setInputPasswd("");
                  handleSetRoomPasswd("");
                } else {
                  setInputPasswd(roomData?.room_passwd ?? "");
                  setPassOnOpen();
                }
              }}
            />
            {roomData?.room_passwd && (
              <Button
                variant="link"
                bg="transparent"
                onClick={() => setPassOnOpen()}
              >
                <Text>查看房间密码</Text>
              </Button>
            )}
          </HStack>
        )}

        {roomData?.members.map((member) => (
          <Box
            key={member.ip}
            w="300px"
            bg="rgb(75 127 187 / 38%)"
            p={2}
            borderRadius={12}
          >
            <Flex alignItems="center" gap={2}>
              <Text
                fontWeight="bold"
                fontSize="1.1rem"
                ml={2}
                color={
                  member.wgnum === userInfo?.wg_data?.wgnum
                    ? "#ffd012"
                    : "white"
                }
              >
                {member.username}
              </Text>
              <Tag
                size="md"
                ml="auto"
                bg="transparent"
                fontWeight="bold"
                color={
                  member.wgnum === userInfo?.wg_data?.wgnum
                    ? rotate
                      ? "#ffa524"
                      : onlineStatus === "在线"
                      ? "#3fdb1d"
                      : "#ff4444"
                    : member.status === "在线"
                    ? "#3fdb1d"
                    : "#ff4444"
                }
              >
                {member.wgnum === userInfo?.wg_data?.wgnum
                  ? rotate
                    ? "检测中"
                    : onlineStatus
                  : member.status}
              </Tag>
            </Flex>

            <Flex mt={1} gap={2}>
              <Tag
                color="white"
                bg="transparent"
                cursor="pointer"
                onClick={() => copyText(String(member.wgnum))}
              >
                编号{member.wgnum}
              </Tag>
              <Tag
                color="white"
                bg="transparent"
                cursor="pointer"
                onClick={() => copyText(member.ip)}
              >
                ip {member.ip}
              </Tag>
              {roomStatus === "hoster" &&
                member.wgnum !== roomData.hoster_wgnum && (
                  <Tag
                    ml="auto"
                    color="white"
                    bg="#be1c1c"
                    cursor="pointer"
                    onClick={() => handleDelMember(member.wgnum)}
                  >
                    踢出
                  </Tag>
                )}
            </Flex>
          </Box>
        ))}
      </VStack>

      <HStack justify="center" spacing={4} mt={2}>
        <Button
          px={0}
          size="lg"
          bg="transparent"
          onClick={roomStatus === "hoster" ? handleCloseRoom : handleExitRoom}
        >
          {roomStatus === "hoster" ? "关闭房间" : "退出房间"}
          <IoIosExit size={30} color="#ff4444" />
        </Button>

        <Text fontSize="lg" fontWeight="bold" mr={3}>
          {roomData?.members.length}/8
        </Text>

        <Button
          px={0}
          size="lg"
          bg="transparent"
          onClick={() => {
            if (disableGetRoom) return;
            setDisableGetRoom(true);
            setTimeout(() => setDisableGetRoom(false), 3000);
            getRoomData();
            getLatency();
          }}
        >
          刷新房间
          <IoReloadCircle size={26} color="#35c535" />
        </Button>
      </HStack>
    </Box>
  );

  return (
    <VStack alignItems="center" spacing={2}>
      <SponsorAd />

      <Button
        variant="link"
        bg="transparent"
        size="lg"
        onClick={() => router.push(`/docs`)}
        color={
          onlineStatus === "在线"
            ? "#a8d1ff"
            : tutorialColor
            ? "#ff0000"
            : "white"
        }
      >
        点我阅读使用文档
      </Button>

      <Flex align="center" gap={3}>
        {roomStatus !== "none" && (
          <Text fontSize={18} fontWeight="bold">
            房间号 {roomData?.hoster_wgnum}
          </Text>
        )}

        <Text
          fontSize={18}
          fontWeight="bold"
          color={onlineStatus === "在线" ? "#3fdb1d" : "#ff0000"}
        >
          {onlineStatus}
        </Text>

        {onlineStatus === "在线" && latency && (
          <Flex align="center" gap={1}>
            <GiNetworkBars size={20} color={getColor(latency)} />
            <Box>{latency}ms</Box>
          </Flex>
        )}

        <Button
          bg="transparent"
          h={5}
          px={0}
          disabled={disableCheckNet || rotate}
          onClick={() => {
            setDisableCheckNet(true);
            setTimeout(() => setDisableCheckNet(false), 2000);
            getLatency();
          }}
        >
          <Text fontSize={18} fontWeight="normal" color="#3fdb1d" ml={2}>
            检测
          </Text>
          <Box animation={rotate ? `${spin} 1s linear infinite` : undefined}>
            <TbReload size={18} />
          </Box>
        </Button>
      </Flex>

      {roomStatus === "none" ? <NonePage /> : <RoomPage />}

      <Box
        textAlign="center"
        position="fixed"
        left="12px"
        bottom="30vh"
        onClick={() => router.push(`/sponsor`)}
        zIndex={100}
        cursor="pointer"
      >
        <Box boxSize={{ base: "8", md: "10" }}>
          <PiCoffeeBold size="100%" />
        </Box>
        <Text fontSize="sm">赞助</Text>
      </Box>
    </VStack>
  );
}
