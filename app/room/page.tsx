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
  Divider,
  Switch,
  Tag,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { openToast } from "@/components/universal/toast";
import { Button } from "@/components/universal/button";
// import { IoMdPersonAdd } from "react-icons/io";
import { IoReloadCircle } from "react-icons/io5";
import { GiNetworkBars } from "react-icons/gi";
import { TbReload } from "react-icons/tb";
import { useUserStateStore } from "@/store/user-state";
import { useDisclosureStore } from "@/store/disclosure";
import { getAuthToken } from "@/store/authKey";
import { useRouter } from "next/navigation";
import { copyText, isInteger } from "@/utils/strings";
import { input } from "framer-motion/client";

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

interface LatencyData {
  min: number;
  ave: number;
  max: number;
  lost: number;
}

interface Member {
  username: string;
  wgnum: number;
  ip: string;
  status: "在线" | "离线";
}

interface RoomInfo {
  user_wgnum: number;
  user_ip: string;
  hoster_wgnum: number;
  hoster_ip: string;
  members: Member[];
  room_passwd: string;
}

interface Response {
  code: number;
  data: RoomInfo | null;
}

interface HandleRoomResponse {
  code: number;
  msg: string;
}

export default function Page() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

  const [roomInfo, setRoomData] = useState<RoomInfo | null>(null);
  const [status, setStatus] = useState<"none" | "member" | "hoster">("none");

  const [loading, setLoading] = useState(false);

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

  const [hideJoinPassInput, setHideJoinPassInput] = useState(true);

  const [inputWgnum, setInputWgnum] = useState("");
  const [inputPasswd, setInputPasswd] = useState("");
  const [wgnum, setUserWgnum] = useState(0);
  const [latencyData, setLatencyData] = useState<LatencyData | null>(null);
  const [checking, setChecking] = useState(true);
  const [checkText, setCheckText] = useState("");
  const { logined, userInfo } = useUserStateStore();

  const { onToggle: gameListToggle } = useDisclosureStore((state) => {
    return state.modifyGameListDisclosure;
  });

  const { onToggle: getWgnumToggle } = useDisclosureStore((state) => {
    return state.modifyGetWgnumDisclosure;
  });

  const { onToggle: loginToggle } = useDisclosureStore((state) => {
    return state.modifyLoginDisclosure;
  });

  const getRoomData = useCallback(
    async (noToast: boolean = true) => {
      // 从环境变量获取 API 地址
      fetch(`${apiUrl}/getRoom`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      })
        .then((resp) => resp.json() as Promise<Response>) // 强制转换为 RoomResponse 类型
        .then((data) => {
          setRoomData(data.data);

          // 使用局部变量进行状态判断
          const currentRoomData = data.data;
          if (currentRoomData) {
            // 房主或成员
            if (currentRoomData.user_wgnum === currentRoomData.hoster_wgnum) {
              setStatus("hoster");
            } else {
              setStatus("member");
            }
          } else {
            setStatus("none");
          }
          if (!noToast)
            openToast({ content: `房间信息已刷新`, status: "info" });
        })
        .catch((error) => {
          console.error(`拉取房间信息出错:${error}`);
          openToast({ content: `拉取房间信息出错:${error}`, status: "error" });
        })
        .finally(() => {});
    },
    [apiUrl]
  );

  const fetchNetworkLatency = useCallback(
    async (checkType: string, auto: boolean = false) => {
      if (wgnum === 0) {
        return;
      }
      setChecking(true);
      if (!auto) {
        setCheckText("");
      }
      try {
        const resp = await fetch(
          `${apiUrl}/networkCheck?wgnum=${wgnum}&checkType=1`
        );
        if (!resp.ok) {
          console.error(`访问接口出错: ${resp.status}`);
        }
        const result = await resp.json();
        if (result.code !== 0) {
          // 未连接
          setLatencyData(null);
        } else {
          // 已连接
          setLatencyData(result.data);

          if (checkType === "long") {
            setCheckText("约10秒后返回详细网络检测结果");
            const resp = await fetch(
              `${apiUrl}/networkCheck?wgnum=${wgnum}&checkType=2`
            );
            if (!resp.ok) {
              console.error(`访问接口出错: ${resp.status}`);
            } else {
              const result = await resp.json();
              if (result.code !== 0) {
                // 未连接
                setLatencyData(null);
              } else {
                // 已连接
                setLatencyData(result.data);
                setCheckText(
                  `平均${result.data.ave}ms，最高${result.data.max}ms，丢包率${result.data.lost}%`
                );
              }
            }
          }
        }
      } catch (err) {}
      setChecking(false);
    },
    [wgnum, apiUrl]
  );

  // const wgReInsert = async () => {
  //   setCheckText("修复中。。。");
  //   try {
  //     const resp = await fetch(`${apiUrl}/wgReinsert`, {
  //       method: "GET",
  //       headers: {
  //         Authorization: `Bearer ${getAuthToken()}`,
  //       },
  //     });

  //     if (resp.ok) {
  //       setCheckText("VPN重连试试，还不行请检查编号是否有效");
  //     } else {
  //       setCheckText("请求失败，请刷新网页再试");
  //     }
  //   } catch (error) {
  //     setCheckText("请求发生错误，请刷新网页再试");
  //   }
  // };

  // 开关任意加入
  const handleSetRoomPasswd = async () => {
    try {
      if (loading === true) {
        throw new Error(`请不要点太快`);
      }

      setLoading(true);
      const resp = await fetch(
        `${apiUrl}/setRoomPasswd?roomPasswd=${inputPasswd}`,
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
        if (roomInfo)
          setRoomData({
            ...roomInfo,
            room_passwd: inputPasswd,
          });
        openToast({ content: data.msg, status: "success" });
      } else {
        openToast({ content: data.msg, status: "warning" });
      }
      if (setPassIsOpen) setPassOnClose();
    } catch (err) {
      openToast({ content: String(err), status: "error" });
    }
  };

  useEffect(() => {
    if (userInfo && userInfo.wg_data) {
      setUserWgnum(userInfo.wg_data.wgnum);
    }
  }, [userInfo]);

  // useEffect(() => {
  //   if (wgnum !== 0) {
  //     const interval = setInterval(() => {
  //       getRoomData();
  //     }, 30000); // 每10秒更新一次房间列表
  //     return () => clearInterval(interval); // 清理定时器
  //   }
  // }, [wgnum, getRoomData]);

  // useEffect(() => {
  //   if (wgnum !== 0 && !checking) {
  //     const interval = setInterval(() => {
  //       fetchNetworkLatency("short", true);
  //     }, 30000); /// 每10秒更新一一次延迟
  //     return () => clearInterval(interval); // 清理定时器
  //   }
  // }, [wgnum, checking, fetchNetworkLatency]);

  useEffect(() => {
    const fetchData = () => {
      // 如果已登录就拉房间信息
      if (wgnum !== 0) {
        getRoomData();
        fetchNetworkLatency("short");
      }
    };
    fetchData();
  }, [wgnum, fetchNetworkLatency, getRoomData]);

  // 发送房间操作请求
  const handleRoomFetch = async (
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
    return resp.json() as Promise<HandleRoomResponse>;
  };

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
  const handleJoinRoom = async () => {
    if (!inputWgnum) {
      return;
    }

    if (!isInteger(inputWgnum)) {
      openToast({ content: "房间号仅支持数字", status: "warning" });
    }

    try {
      const data = await handleRoomFetch(
        "joinRoom",
        Number(inputWgnum),
        inputPasswd
      );
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
      handleSetRoomPasswd();
    }
  };
  const handleJoinRoomEnter = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      handleJoinRoom();
    }
  };

  // 没登录就让去登录
  if (!logined) {
    return (
      <VStack spacing={6} align="center">
        <Heading size="md">你还没登陆呢</Heading>

        <Button variant="outline" rounded={10} onClick={loginToggle} border={0}>
          点击登录
        </Button>
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

          <Button
            rounded={5}
            onClick={getWgnumToggle}
            bgColor="#007bc0"
            size="sm"
          >
            点我获取编号
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
                type="number"
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
                  handleJoinRoom();
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

        <Heading my={3}>请选择操作</Heading>

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
              <Button bgColor="#007bc0" onClick={handleSetRoomPasswd}>
                提交
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
          {roomInfo?.members.map((item, index) => (
            <Box w="300px" key={item.ip}>
              <Flex>
                <Text fontWeight="bold">{item.username}</Text>
                {item.wgnum === roomInfo.hoster_wgnum && (
                  <Tag fontWeight="bold" ml={3} bg="#ffd012">
                    房主
                  </Tag>
                )}

                <Tag
                  ml="auto"
                  color="white"
                  bg={item.status === "在线" ? "#1c9f00" : "#d80000"}
                >
                  {item.status}
                </Tag>
              </Flex>

              <Flex my={2}>
                <Tag
                  onClick={() => {
                    copyText(String(item.wgnum));
                  }}
                >
                  编号 {item.wgnum}
                </Tag>
                <Tag
                  ml={3}
                  onClick={() => {
                    copyText(item.ip);
                  }}
                >
                  IP {item.ip}
                </Tag>

                {status === "hoster" && (
                  <Button
                    h="26px"
                    size="sm"
                    lineHeight={0}
                    bgColor="#d83636"
                    ml="auto"
                    hidden={item.wgnum === roomInfo.hoster_wgnum}
                    onClick={() => handleDelMember(item.wgnum)}
                  >
                    踢出
                  </Button>
                )}
              </Flex>

              {index < roomInfo.members.length - 1 && (
                <Divider borderWidth={2} mt={1} />
              )}
            </Box>
          ))}
        </VStack>

        <HStack justify="center">
          {status === "hoster" && (
            <HStack>
              <Text fontWeight="bold">任意加入</Text>
              <Switch
                size="md"
                colorScheme="green"
                isChecked={roomInfo?.room_passwd ? false : true}
                onChange={() => {
                  // 已设置密码就清空密码
                  if (roomInfo?.room_passwd) {
                    setInputPasswd("");
                    handleSetRoomPasswd();
                  } else {
                    setInputPasswd(
                      roomInfo?.room_passwd ? roomInfo?.room_passwd : ""
                    );
                    setPassOnOpen();
                  }
                }}
              />

              <Button
                px={0}
                bg="transparent"
                onClick={() => {
                  setInputPasswd(
                    roomInfo?.room_passwd ? roomInfo?.room_passwd : ""
                  );
                  setPassOnOpen();
                }}
                isDisabled={roomInfo?.room_passwd ? false : true}
              >
                <Text>设置密码</Text>
              </Button>
            </HStack>
          )}

          <Button
            px={2}
            bg="transparent"
            onClick={() => {
              if (disableGetRoom === true) return;

              setDisableGetRoom(true);
              // 设置定时器，2秒后重新启用按钮
              setTimeout(() => {
                setDisableGetRoom(false); // 启用按钮
              }, 3000);

              fetchNetworkLatency("short");
              getRoomData(false);
            }}
          >
            <Text mr={1}>刷新</Text>
            <IoReloadCircle size={30} color="#35c535" />
          </Button>
        </HStack>

        <VStack alignItems="center">
          <Button
            h="2.3rem"
            w="6rem"
            mt={3}
            size="lg"
            bg="#8f2424"
            onClick={status === "hoster" ? handleCloseRoom : handleExitRoom}
          >
            {status === "hoster" ? "关闭房间" : "退出房间"}
          </Button>
        </VStack>
      </Box>
    );
  }

  return (
    <VStack alignItems="center">
      <Flex align="center">
        <Text fontSize={18} fontWeight="bold" color="#ffd012">
          {status === "none" ? "" : `房间号 ${wgnum}`}
        </Text>
        <Text
          fontSize={18}
          mx={3}
          fontWeight="bold"
          color={latencyData ? "#3fdb1d" : "#ff0000"}
        >
          {latencyData ? "已连接" : "未连接"}
        </Text>
        {latencyData && (
          <Flex align="center">
            <GiNetworkBars size={20} color={getColor(latencyData.min)} />
            <Box ml={1}>{latencyData.min}ms</Box>
          </Flex>
        )}
        <Button
          bg="transparent"
          h={5}
          px={0}
          onClick={() => {
            fetchNetworkLatency("long");
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

      {!latencyData && !checkText && (
        <Flex align="center">
          <Text>不知道怎么连接喵服？</Text>
          <Button
            variant="link"
            bg="#7242ad"
            size="sm"
            p={1}
            h={7}
            onClick={() => {
              router.push("/tutorial");
            }}
          >
            点我学习
          </Button>
        </Flex>
        // <>

        //   <Flex align="center">
        //     <Text>WG打开了还是检测不到？</Text>
        //     <Button
        //       variant="link"
        //       size="sm"
        //       p={1}
        //       h={7}
        //       onClick={wgReInsert}
        //     >
        //       点我修复
        //     </Button>
        //   </Flex>
        // </>
      )}

      <Text>{checkText}</Text>

      {status === "none" ? nonePage() : roomPage()}

      <Button
        h="36px"
        w="90px"
        mt={3}
        bgColor="#7242ad"
        fontSize="16px"
        onClick={gameListToggle}
      >
        联机教程
      </Button>

      <Text>里面有已收录的游戏联机教程</Text>
    </VStack>
  );
}
