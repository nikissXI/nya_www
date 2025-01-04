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
import { useDisclosureStore } from "@/store/disclosure";
import { getAuthToken } from "@/store/authKey";
import { copyText, isInteger } from "@/utils/strings";
import { IoIosExit } from "react-icons/io";
import { FaCheck, FaTimes } from "react-icons/fa";
import { PiCoffeeBold } from "react-icons/pi";
import { useRouter } from "next/navigation";

const announcement = [
  {
    date: "2025/01/02 - 01:00",
    content:
      "优化检测在线逻辑，提高获取延迟精度，电脑(win)不再需要防火墙放通ping协议以检测在线",
  },
  {
    date: "2024/12/05 - 22:00",
    content: "更新了连接喵服的视频教程，就是怎么离线变在线",
  },
  {
    date: "2024/11/25 - 21:00",
    content: "解决联机高峰期喵服网络卡顿问题",
  },
  {
    date: "2024/11/22 - 21:45",
    content: "如果安卓WG导入conf key报错，请到教程里下载最新的安装包更新",
  },
];

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

  const [disableCheckNet, setDisableCheckNet] = useState(false);
  const [disableGetRoom, setDisableGetRoom] = useState(false);

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
    isOpen: setWarnIsOpen,
    onOpen: setWarnOnOpen,
    onClose: setWarnOnClose,
  } = useDisclosure();

  const [hideJoinPassInput, setHideJoinPassInput] = useState(true);

  const [inputWgnum, setInputWgnum] = useState("");
  const [inputPasswd, setInputPasswd] = useState("");
  const [checking, setChecking] = useState(true);
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
  } = useUserStateStore();

  const { onToggle: gameListToggle } = useDisclosureStore((state) => {
    return state.modifyGameListDisclosure;
  });

  const { onToggle: loginToggle } = useDisclosureStore((state) => {
    return state.modifyLoginDisclosure;
  });

  const updatedRoomInfo = useCallback(
    (onlineStatus: "在线" | "离线") => {
      if (roomData && userInfo?.wg_data)
        setRoomData({
          ...roomData,
          members: roomData.members.map((member) => {
            if (member.wgnum === userInfo?.wg_data?.wgnum) {
              return { ...member, status: onlineStatus }; // 修改状态为离线
            }
            return member; // 保持其他成员不变
          }),
        });
    },
    [roomData, userInfo, setRoomData]
  );

  useEffect(() => {
    updatedRoomInfo(latency ? "在线" : "离线");
  }, [latency]);

  useEffect(() => {
    setChecking(true);
    if (latency === undefined) {
      getLatency();
    }
    setChecking(false);
  }, [getLatency, latency]);

  useEffect(() => {
    if (roomData === undefined) {
      getRoomData();
    }
  }, [roomData, getRoomData]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;

    if (!latency) {
      intervalId = setInterval(() => {
        setTutorialColor((prev) => !prev);
      }, 300);
    }

    // 清理定时器
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [latency]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;

    intervalId = setInterval(() => {
      getLatency();
    }, 60000);

    // 清理定时器
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [latency]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;

    intervalId = setInterval(() => {
      getRoomData();
    }, 3600000);

    // 清理定时器
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [latency]);

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
      handleWgnum: number,
      roomPasswd: string = ""
    ): Promise<HandleRoomResponse> => {
      if (loading === true) {
        throw new Error(`请不要点太快`);
      }
      setLoading(true);
      const resp = await fetch(
        `${apiUrl}/handleRoom?handleType=${handleType}&wgnum=${handleWgnum}&roomPasswd=${roomPasswd}`,
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
        // 编号失效刷新页面
        window.location.reload();
      }
      return data;
    },
    [apiUrl, loading]
  );

  // 创建房间
  const handleCreateRoom = async () => {
    try {
      const data = await handleRoomFetch("createRoom", 0);
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
      const data = await handleRoomFetch("closeRoom", 0);
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
  const handleJoinRoom = async (wgnum: string, passwd: string) => {
    if (!wgnum) {
      return;
    }

    if (!isInteger(wgnum)) {
      openToast({ content: "房间号是整数，不知道就问房主", status: "warning" });
      return;
    }

    try {
      const data = await handleRoomFetch("joinRoom", Number(wgnum), passwd);
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
      const data = await handleRoomFetch("exitRoom", 0);
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
  const handleDelMember = async (delWgnum: number) => {
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
  };

  function getColor(latency: number) {
    if (latency < 80) return "#3fdb1d";
    else if (latency < 160) return "#ffa524";
    else return "#ff3b3b";
  }

  const handleSetPassEnter = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      handleSetRoomPasswd(inputPasswd);
    }
  };
  const handleJoinRoomEnter = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      handleJoinRoom(inputWgnum, inputPasswd);
    }
  };

  // 没登录就让去登录
  if (!logined) {
    return (
      <VStack spacing={3} align="center">
        <Heading size="md">你还没登陆呢</Heading>

        <Button variant="outline" rounded={10} onClick={loginToggle} border={0}>
          点击登录
        </Button>

        <Heading size="sm" pt={6}>
          温馨提示
        </Heading>
        <Text px={10}>
          如果遇到网站功能异常，可以换下面这些浏览器试试，仅做推荐
          <br />
          苹果：内置浏览器Safari
          <br />
          安卓：via、夸克
          <br />
          电脑：谷歌、火狐、edge
        </Text>
      </VStack>
    );
  }

  // 没编号就去获取
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

  function nonePage() {
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
                value={inputWgnum}
                onChange={(e) => {
                  setInputWgnum(e.target.value);
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
                  handleJoinRoom(inputWgnum, inputPasswd);
                }}
                // mr={5}
              >
                加入
              </Button>
              {/* <Button
                bgColor="#d42424"
                onClick={() => {
                  joinOnClose();
                }}
              >
                取消
              </Button> */}
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
  }

  function roomPage() {
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
              {/* <Button
                bgColor="#d42424"
                onClick={() => {
                  setPassOnClose();
                }}
              >
                取消
              </Button> */}
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
              p={2}
              borderRadius={12}
            >
              <Flex>
                <Text
                  fontWeight="bold"
                  fontSize="1.1rem"
                  ml={2}
                  color={
                    item.wgnum === userInfo?.wg_data?.wgnum
                      ? "#ffd012"
                      : "white"
                  }
                >
                  {item.username}
                </Text>

                <Tag
                  size="md"
                  ml="auto"
                  bg="transparent"
                  fontWeight="bold"
                  color={
                    item.wgnum === userInfo?.wg_data?.wgnum
                      ? latency
                        ? "#3fdb1d"
                        : "#ff4444"
                      : item.status === "在线"
                      ? "#3fdb1d"
                      : "#ff4444"
                  }
                >
                  {item.wgnum === userInfo?.wg_data?.wgnum
                    ? latency
                      ? "在线"
                      : "离线"
                    : item.status}
                </Tag>
              </Flex>

              <Flex mt={1}>
                <Tag
                  onClick={() => {
                    copyText(String(item.wgnum));
                  }}
                  color="white"
                  bg="transparent"
                >
                  编号{item.wgnum}
                </Tag>
                <Tag
                  onClick={() => {
                    copyText(item.ip);
                  }}
                  color="white"
                  bg="transparent"
                >
                  ip {item.ip}
                </Tag>

                {roomStatus === "hoster" &&
                  item.wgnum !== roomData.hoster_wgnum && (
                    <Tag
                      ml="auto"
                      color="white"
                      bg="#be1c1c"
                      onClick={() => handleDelMember(item.wgnum)}
                      cursor="pointer"
                    >
                      踢出
                    </Tag>
                  )}
              </Flex>

              {/* {index < roomData.members.length - 1 && (
                <Divider borderWidth={2} mt={1} />
              )} */}
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
            onClick={() => {
              if (disableGetRoom === true) return;

              setDisableGetRoom(true);
              // 设置定时器，2秒后重新启用按钮
              setTimeout(() => {
                setDisableGetRoom(false); // 启用按钮
              }, 3000);

              getLatency();
              getRoomData();
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
    <VStack alignItems="center">
      <Button
        variant="link"
        bg="transparent"
        color="#ffca3d"
        fontWeight="bold"
        onClick={setWarnOnOpen}
      >
        查看公告（{announcement[0]?.date}更新）
      </Button>

      <Modal isOpen={setWarnIsOpen} onClose={setWarnOnClose}>
        <ModalOverlay />
        <ModalContent bgColor="#002f5c">
          <ModalCloseButton />

          <ModalBody py={6}>
            {announcement.map((message, index) => (
              <Box key={index}>
                <Text fontWeight="bold" fontSize="lg" color="#ffca3d">
                  {message.date}
                </Text>
                <Text pb={3}>{message.content}</Text>
              </Box>
            ))}
          </ModalBody>
        </ModalContent>
      </Modal>

      <Button
        variant="link"
        bg="transparent"
        size="lg"
        onClick={gameListToggle}
        color={latency ? "#a8d1ff" : tutorialColor ? "#ff0000" : "white"}
      >
        点我查看使用教程
      </Button>

      <Flex align="center">
        {roomStatus !== "none" && (
          <Text fontSize={18} fontWeight="bold" mr={3}>
            房间号 {roomData?.hoster_wgnum}
          </Text>
        )}

        <Text
          fontSize={18}
          p={0}
          mr={1}
          fontWeight="bold"
          color={latency ? "#3fdb1d" : "#ff0000"}
        >
          {latency ? "在线" : "离线"}
        </Text>
        {latency ? (
          <Flex align="center">
            <GiNetworkBars size={20} color={getColor(latency)} />
            <Box ml={1}>{latency}ms</Box>
          </Flex>
        ) : null}
        <Button
          bg="transparent"
          h={5}
          px={0}
          disabled={disableCheckNet}
          onClick={() => {
            setDisableCheckNet(true);
            setTimeout(() => {
              setDisableCheckNet(false);
            }, 2000);

            getLatency();
          }}
          isDisabled={checking}
        >
          <Text fontSize={18} fontWeight="normal" color="#3fdb1d" ml={2}>
            检测
          </Text>
          <Box animation={checking ? `${spin} 1s linear infinite` : "none"}>
            <TbReload size={18} />
          </Box>
        </Button>
      </Flex>

      {roomStatus === "none" ? nonePage() : roomPage()}

      <Box
        position="fixed"
        left="12px"
        bottom="30vh"
        onClick={() => {
          router.push(`/sponsor`);
        }}
        zIndex={100}
      >
        <PiCoffeeBold size={26} />
        <Text fontSize="sm">赞助</Text>
      </Box>
    </VStack>
  );
}
