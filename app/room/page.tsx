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
import { IoMdPersonAdd } from "react-icons/io";
import { IoReloadCircle } from "react-icons/io5";
import { GiNetworkBars } from "react-icons/gi";
import { TbReload } from "react-icons/tb";
import { useUserStateStore } from "@/store/user-state";
import { useDisclosureStore } from "@/store/disclosure";
import { getAuthToken } from "@/store/authKey";
import { useRouter } from "next/navigation";
import { copyText } from "@/utils/strings";

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
  status: "未连接" | "待加入" | "已加入";
}

interface RoomInfo {
  user_wgnum: number;
  user_ip: string;
  hoster_wgnum: number;
  hoster_ip: string;
  members: Member[];
  public_room: number;
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
    isOpen: addIsOpen,
    onOpen: addOnopen,
    onClose: addOnClose,
  } = useDisclosure();

  const [inputWgnum, setInputWgnum] = useState<number>(0);
  const [wgnum, setUserWgnum] = useState<number>(0);
  const [latencyData, setLatencyData] = useState<LatencyData | null>(null);
  const [checking, setChecking] = useState<boolean>(true);
  const [checkText, setCheckText] = useState<string>("");
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

  const wgReInsert = async () => {
    setCheckText("修复中。。。");
    try {
      const resp = await fetch(`${apiUrl}/wgReinsert`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      if (resp.ok) {
        setCheckText("VPN重连试试，还不行请检查编号是否有效");
      } else {
        setCheckText("请求失败，请刷新网页再试");
      }
    } catch (error) {
      setCheckText("请求发生错误，请刷新网页再试");
    }
  };

  // 开关任意加入
  const publicRoomSwitch = async (publicRoom: number) => {
    try {
      if (loading === true) {
        throw new Error(`请不要点太快`);
      }

      setLoading(true);
      const resp = await fetch(`${apiUrl}/publicRoom?public=${publicRoom}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      setLoading(false);
      if (!resp.ok) {
        throw new Error(`访问接口出错: ${resp.status}`);
      }

      const data = await resp.json();
      if (data.code === 0) {
        if (roomInfo)
          setRoomData({
            ...roomInfo,
            public_room: publicRoom === 1 ? 1 : 0,
          });
        openToast({ content: data.msg, status: "success" });
      } else {
        openToast({ content: data.msg, status: "error" });
      }
    } catch (err) {
      openToast({ content: String(err), status: "error" });
    }
  };

  useEffect(() => {
    if (userInfo && userInfo.wg_data) {
      setUserWgnum(userInfo.wg_data.wgnum);
    }
  }, [userInfo]);

  useEffect(() => {
    if (wgnum !== 0) {
      const interval = setInterval(() => {
        getRoomData();
      }, 30000); // 每10秒更新一次房间列表
      return () => clearInterval(interval); // 清理定时器
    }
  }, [wgnum, getRoomData]);

  useEffect(() => {
    if (wgnum !== 0 && !checking) {
      const interval = setInterval(() => {
        fetchNetworkLatency("short", true);
      }, 30000); /// 每10秒更新一一次延迟
      return () => clearInterval(interval); // 清理定时器
    }
  }, [wgnum, checking, fetchNetworkLatency]);

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
    handleWgnum: number
  ): Promise<HandleRoomResponse> => {
    if (loading === true) {
      throw new Error(`请不要点太快`);
    }

    setLoading(true);
    const resp = await fetch(
      `${apiUrl}/handleRoom?handleType=${handleType}&wgnum=${handleWgnum}`,
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
    try {
      const data = await handleRoomFetch("joinRoom", inputWgnum);
      if (data.code === 0) {
        getRoomData();
        joinOnClose();
        setInputWgnum(0);
      } else {
        openToast({ content: data.msg, status: "error" });
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

  // 添加成员
  const handleAddMember = async () => {
    if (!inputWgnum) {
      return;
    }
    try {
      const data = await handleRoomFetch("addMember", inputWgnum);
      if (data.code === 0) {
        getRoomData();
        addOnClose();
        setInputWgnum(0);
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
    if (latency < 80) return "#04f504";
    else if (latency < 160) return "#ffa524";
    else return "#ff3b3b";
  }

  const handleAddMemberEnter = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      handleAddMember();
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
                placeholder="请输入房主的编号"
                value={inputWgnum === 0 ? "" : inputWgnum}
                onChange={(e) => setInputWgnum(Number(e.target.value))}
              />
            </ModalBody>
            <ModalFooter>
              <Button
                bgColor="#007bc0"
                onClick={() => {
                  handleJoinRoom();
                }}
                mr={5}
              >
                加入
              </Button>
              <Button
                bgColor="#d42424"
                onClick={() => {
                  joinOnClose();
                  setInputWgnum(0);
                }}
              >
                取消
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Heading my={3}>请选择操作</Heading>

        <VStack spacing={6} alignItems="center">
          <Button h="50px" fontSize="25px" onClick={handleCreateRoom}>
            创建房间
          </Button>

          <Button h="50px" fontSize="25px" onClick={joinOnOpen}>
            加入房间
          </Button>
        </VStack>
      </Box>
    );
  }

  function roomPage() {
    return (
      <Box textAlign="center">
        <Modal isOpen={addIsOpen} onClose={addOnClose}>
          <ModalOverlay />
          <ModalContent bgColor="#002f5c">
            <ModalHeader>添加成员</ModalHeader>

            <ModalCloseButton />

            <ModalBody onKeyDown={handleAddMemberEnter}>
              <Input
                placeholder="请输入新成员编号"
                type="number"
                onChange={(e) => setInputWgnum(Number(e.target.value))}
              />
            </ModalBody>
            <ModalFooter>
              <Button bgColor="#007bc0" onClick={handleAddMember} mr={5}>
                添加
              </Button>
              <Button
                bgColor="#d42424"
                onClick={() => {
                  setInputWgnum(0);
                  addOnClose();
                }}
              >
                取消
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <IPList
          roomInfo={roomInfo as RoomInfo}
          isOwner={status === "hoster" ? true : false}
          onDelete={handleDelMember}
          onOpen={addOnopen}
        />

        <HStack justify="center">
          <Text fontWeight="bold">任意加入</Text>
          <Switch
            size="md"
            colorScheme="green"
            isChecked={roomInfo?.public_room ? true : false}
            isDisabled={status !== "hoster"}
            onChange={() => {
              publicRoomSwitch(roomInfo?.public_room ? 0 : 1);
            }}
          />

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
              getRoomData(false);
            }}
          >
            <Text mr={1}>刷新</Text>
            <IoReloadCircle size={30} color="#35c535" />
          </Button>

          {status === "hoster" && (
            <Button
              px={0}
              bg="transparent"
              onClick={addOnopen}
              isDisabled={
                roomInfo && roomInfo.members.length < 8 ? false : true
              }
            >
              <Text mr={1}>
                {roomInfo && roomInfo.members.length < 8
                  ? "添加成员"
                  : "房间已满"}
              </Text>

              <IoMdPersonAdd size={30} color="#35c535" />
            </Button>
          )}
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
        <Text fontSize={18} fontWeight="bold" color="#ffd964">
          {status !== "none" ? `房间编号 ${wgnum}` : `你的编号 ${wgnum}`}
        </Text>
        <Text
          fontSize={18}
          mx={3}
          fontWeight="bold"
          color={latencyData ? "#3fdb1d" : "#ff3838"}
        >
          {latencyData ? "已连接" : "喵服未连接"}
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
          <Text fontSize={18} fontWeight="normal" color="#49ffb6" ml={2}>
            检测
          </Text>
          <Box animation={checking ? `${spin} 1s linear infinite` : "none"}>
            <TbReload size={18} />
          </Box>
        </Button>
      </Flex>

      {!latencyData && !checkText && (
        <>
          <Flex align="center">
            <Text>不知道怎么连接喵服？</Text>
            <Button
              variant="link"
              bg="#aa33ae"
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

          <Flex align="center">
            <Text>WG打开了还是检测不到？</Text>
            <Button
              variant="link"
              // bg="#aa33ae"
              size="sm"
              p={1}
              h={7}
              onClick={wgReInsert}
            >
              点我修复
            </Button>
          </Flex>
        </>
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

interface IPListProps {
  roomInfo: RoomInfo;
  isOwner: boolean;
  onDelete: (wgnum: number) => void; // 删除IP的回调函数
  onOpen: () => void;
}

function IPList({ roomInfo, isOwner, onDelete }: IPListProps) {
  function getColor(status: "未连接" | "待加入" | "已加入"): string {
    if (status === "未连接") return "#d80000";
    else if (status === "待加入") return "#b8670f";
    else return "#1a9225";
  }

  return (
    <VStack>
      {roomInfo.members.map((item, index) => (
        <Box w="300px" key={item.ip}>
          <Flex>
            <Text fontWeight="bold">{item.username}</Text>
            {item.wgnum === roomInfo.hoster_wgnum && (
              <Tag fontWeight="bold" ml={3} bg="#ffd012">
                房主
              </Tag>
            )}
            <Tag ml="auto" color="white" bg={getColor(item.status)}>
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

            {isOwner && (
              <Button
                h="26px"
                size="sm"
                lineHeight={0}
                bgColor="#d83636"
                ml="auto"
                hidden={item.wgnum === roomInfo.hoster_wgnum}
                onClick={() => onDelete(item.wgnum)}
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
  );
}
