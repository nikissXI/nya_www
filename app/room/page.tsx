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
// import { IoMdPersonAdd } from "react-icons/io";
import { IoReloadCircle } from "react-icons/io5";
import { GiNetworkBars } from "react-icons/gi";
import { TbReload } from "react-icons/tb";
import { useUserStateStore } from "@/store/user-state";
import { useDisclosureStore } from "@/store/disclosure";
import { getAuthToken } from "@/store/authKey";
import { copyText, isInteger } from "@/utils/strings";
import { IoIosExit } from "react-icons/io";
import { FaCheck, FaTimes } from "react-icons/fa";
import { IoMdCloseCircleOutline } from "react-icons/io";

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

  const [tutorialColor, setTutorialColor] = useState(true);

  const [roomInfo, setRoomData] = useState<RoomInfo | null>(null);
  const [status, setStatus] = useState<"none" | "member" | "hoster">("none");

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

  const [hideJoinPassInput, setHideJoinPassInput] = useState(true);

  const [inputWgnum, setInputWgnum] = useState("");
  const [inputPasswd, setInputPasswd] = useState("");
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
      if (!userInfo?.wg_data) return;
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
    [userInfo, apiUrl]
  );

  const updateMemberStatus = (
    roomInfo: RoomInfo,
    userWgnum: number,
    onlineStatus: "在线" | "离线"
  ): RoomInfo => {
    return {
      ...roomInfo,
      members: roomInfo.members.map((member) => {
        if (member.wgnum === userWgnum) {
          return { ...member, status: onlineStatus }; // 修改状态为离线
        }
        return member; // 保持其他成员不变
      }),
    };
  };

  const updatedRoomInfo = useCallback(
    (onlineStatus: "在线" | "离线") => {
      if (roomInfo && userInfo?.wg_data)
        setRoomData(
          updateMemberStatus(roomInfo, userInfo?.wg_data?.wgnum, onlineStatus)
        );
    },
    [roomInfo, userInfo]
  );

  useEffect(() => {
    updatedRoomInfo(latencyData ? "在线" : "离线");
  }, [latencyData]);

  const fetchNetworkLatency = useCallback(
    async (checkType: string) => {
      if (!userInfo?.wg_data) return;

      setChecking(true);
      try {
        const resp = await fetch(
          `${apiUrl}/networkCheck?wgnum=${userInfo.wg_data.wgnum}&checkType=1`
        );
        if (!resp.ok) {
          console.error(`访问接口出错: ${resp.status}`);
        }
        const result = await resp.json();
        if (result.code !== 0) {
          // 未连接
          openToast({
            content: "你还没连接喵服将无法联机",
            status: "warning",
          });

          setLatencyData(null);
          setCheckText("");
        } else {
          // 已连接
          setLatencyData(result.data);

          if (checkType === "long") {
            setCheckText("约10秒后返回详细网络检测结果");
            const resp = await fetch(
              `${apiUrl}/networkCheck?wgnum=${userInfo.wg_data.wgnum}&checkType=2`
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
    [userInfo, apiUrl]
  );

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined; // 定义变量以存储定时器ID

    if (!latencyData) {
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
  }, [latencyData]); // 将 stopChanging 作为依赖项

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
          if (roomInfo)
            setRoomData({
              ...roomInfo,
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
    [apiUrl, loading, roomInfo, setPassIsOpen, setPassOnClose]
  );

  useEffect(() => {
    fetchNetworkLatency("short");
  }, [userInfo, fetchNetworkLatency]);

  useEffect(() => {
    getRoomData();
  }, [userInfo, getRoomData]);

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
      return resp.json() as Promise<HandleRoomResponse>;
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
          {roomInfo?.members.map((item, index) => (
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
                {/* {item.wgnum === userInfo?.wg_data.wgnum && (
                  <Tag fontWeight="bold" ml={3} bg="#ffd012">
                    自己
                  </Tag>
                )} */}

                <Tag
                  size="md"
                  ml="auto"
                  // color="white"
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

                {status === "hoster" &&
                  item.wgnum !== roomInfo.hoster_wgnum && (
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

              {/* {index < roomInfo.members.length - 1 && (
                <Divider borderWidth={2} mt={1} />
              )} */}
            </Box>
          ))}
        </VStack>

        {status === "hoster" && (
          <HStack justify="center" mt={3} spacing={0}>
            <Text fontWeight="bold">允许直接加入</Text>
            {roomInfo?.room_passwd ? <FaTimes /> : <FaCheck />}

            <Switch
              px={2}
              size="md"
              colorScheme="green"
              isChecked={roomInfo?.room_passwd ? false : true}
              onChange={() => {
                // 已设置密码就清空密码
                if (roomInfo?.room_passwd) {
                  setInputPasswd("");
                  handleSetRoomPasswd("");
                } else {
                  setInputPasswd(
                    roomInfo?.room_passwd ? roomInfo?.room_passwd : ""
                  );
                  setPassOnOpen();
                }
              }}
            />

            <Button
              variant="link"
              bg="transparent"
              hidden={roomInfo?.room_passwd ? false : true}
              onClick={() => {
                setInputPasswd(
                  roomInfo?.room_passwd ? roomInfo?.room_passwd : ""
                );
                setPassOnOpen();
              }}
              isDisabled={roomInfo?.room_passwd ? false : true}
            >
              <Text>查看房间密码</Text>
            </Button>
          </HStack>
        )}

        <HStack justify="center">
          <Button
            size="lg"
            bg="transparent"
            onClick={status === "hoster" ? handleCloseRoom : handleExitRoom}
          >
            {status === "hoster" ? "关闭房间" : "退出房间"}
            <IoIosExit size={30} color="#ff4444" />
          </Button>

          <Button
            size="lg"
            bg="transparent"
            onClick={() => {
              if (disableGetRoom === true) return;

              setDisableGetRoom(true);
              // 设置定时器，2秒后重新启用按钮
              setTimeout(() => {
                setDisableGetRoom(false); // 启用按钮
              }, 3000);

              if (!checking) fetchNetworkLatency("short");
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
    <VStack alignItems="center">
      <Flex align="center">
        {status !== "none" && (
          <Text fontSize={18} fontWeight="bold" mr={3}>
            房间号 {roomInfo?.hoster_wgnum}
          </Text>
        )}

        <Text
          fontSize={18}
          p={0}
          mr={1}
          fontWeight="bold"
          color={latencyData ? "#3fdb1d" : "#ff0000"}
        >
          {latencyData ? "在线" : "离线"}
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
          // disabled={disableCheckNet}
          onClick={() => {
            // setDisableCheckNet(true);
            // setTimeout(() => {
            //   setDisableCheckNet(false);
            // }, 2000);

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
      {/* {!latencyData && !checkText && (
        <Flex align="center">
          <Button
            variant="link"
            bg="transparent"
            size="lg"
            onClick={() => {
              router.push("/tutorial");
            }}
            color="#a8d1ff"
          >
            点我学习连接喵服
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
      )} */}

      {checkText && (
        <HStack>
          <Text>{checkText}</Text>
          <IoMdCloseCircleOutline
            size={18}
            onClick={() => {
              setCheckText("");
            }}
          />
        </HStack>
      )}

      <Button
        variant="link"
        bg="transparent"
        size="lg"
        // bg="#7242ad"
        // fontSize="16px"
        onClick={gameListToggle}
        color={latencyData ? "#a8d1ff" : tutorialColor ? "#ff0000" : "white"}
      >
        点我查看使用教程
      </Button>

      {status === "none" ? nonePage() : roomPage()}

      {/* <Text>里面有已收录的游戏联机教程</Text> */}
    </VStack>
  );
}
