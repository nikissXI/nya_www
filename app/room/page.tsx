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
  VStack,
  Collapse,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Table,
  Thead,
  Flex,
  keyframes,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/universal/button";
import { FiDelete } from "react-icons/fi";
import { IoMdPersonAdd } from "react-icons/io";
import { IoReloadCircle } from "react-icons/io5";
import { GiNetworkBars } from "react-icons/gi";
import { TbReload } from "react-icons/tb";
import { WarningIcon } from "@chakra-ui/icons";
import { useUserStateStore } from "@/store/user-state";
import { useDisclosureStore } from "@/store/disclosure";
import { getAuthToken } from "@/store/authKey";

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

  const [roomInfo, setRoomData] = useState<RoomInfo | null>(null);
  const [status, setStatus] = useState<"none" | "member" | "hoster">("none");

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

  const [showTips, setShowTips] = useState(false);

  const tips = [
    "建议使用浏览器收藏本网站，方便打开网站进行联机，不建议在QQ里登陆本网站，轻量浏览器推荐via",
    "连上喵服后，顶部会显示网络延迟，检测可以点击以测试网络稳定性，如果网络差就别联机了",
    "玩家间联机需要彼此处于一个房间才能通信，就是一个人创建房间，其他人加入，如果加入失败就问房主有没有正确添加成员",
    "只要设备能连上喵服就能互相通信，不限系统，如果游戏支持，可以实现手机与电脑联机",
    "本平台支持绝大部分游戏局域网联机，目前已知只有《逃脱者：困境突围》这个游戏联机需要另外下载工具，具体看联机教程",
  ];

  const getRoomData = useCallback(async () => {
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
      })
      .catch((error) => {
        console.error("拉取房间信息出错:", error);
      })
      .finally(() => {});
  }, [apiUrl]);

  const fetchNetworkLatency = useCallback(
    async (checkType: string, auto: boolean = false) => {
      if (wgnum === 0) {
        return;
      }
      setChecking(true);
      if (!auto) {
        setCheckText("");
      }

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
        setCheckText("修复成功！把VPN开关重新打开试试");
      } else {
        setCheckText("请求失败，请刷新网页再试");
      }
    } catch (error) {
      setCheckText("请求发生错误，请刷新网页再试");
    }
  };

  useEffect(() => {
    if (userInfo && userInfo.wg_data) {
      setUserWgnum(userInfo.wg_data.wgnum);
    }
  }, [userInfo]);

  useEffect(() => {
    if (wgnum !== 0) {
      const interval = setInterval(getRoomData, 10000); // 每10秒更新一次数据
      return () => clearInterval(interval); // 清理定时器
    }
  }, [wgnum, getRoomData]);

  useEffect(() => {
    if (wgnum !== 0 && !checking) {
      const interval = setInterval(() => {
        fetchNetworkLatency("short", true);
      }, 10000); // 每10秒更新一次数据
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

  const fetchHandleRoom = async (
    handleType: string,
    handleWgnum: number
  ): Promise<HandleRoomResponse> => {
    const resp = await fetch(
      `${apiUrl}/handleRoom?handleType=${handleType}&wgnum=${handleWgnum}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );
    if (!resp.ok) {
      throw new Error(`访问接口出错: ${resp.status}`);
    }
    return resp.json() as Promise<HandleRoomResponse>;
  };

  // 创建房间
  const handleCreateRoom = async () => {
    try {
      const data = await fetchHandleRoom("createRoom", 0);
      if (data.code === 0) {
        getRoomData();
      } else {
        alert(data.msg);
      }
    } catch (error) {
      alert(`请求出错: ${error}`);
    }
  };

  // 关闭房间
  const handleCloseRoom = async () => {
    try {
      const data = await fetchHandleRoom("closeRoom", 0);
      if (data.code === 0) {
        getRoomData();
      } else {
        alert(data.msg);
      }
    } catch (error) {
      alert(`请求出错: ${error}`);
    }
  };

  // 加入房间
  const handleJoinRoom = async () => {
    if (!inputWgnum) {
      return;
    }
    try {
      const data = await fetchHandleRoom("joinRoom", inputWgnum);
      if (data.code === 0) {
        getRoomData();
      } else {
        alert(data.msg);
      }
    } catch (error) {
      alert(`请求出错: ${error}`);
    }
  };

  // 退出房间
  const handleExitRoom = async () => {
    try {
      const data = await fetchHandleRoom("exitRoom", 0);
      if (data.code === 0) {
        getRoomData();
      } else {
        alert(data.msg);
      }
    } catch (error) {
      alert(`请求出错: ${error}`);
    }
  };

  // 添加成员
  const handleAddMember = async () => {
    if (!inputWgnum) {
      return;
    }
    try {
      const data = await fetchHandleRoom("addMember", inputWgnum);
      if (data.code === 0) {
        getRoomData();
        addOnClose();
      } else {
        alert(data.msg);
      }
    } catch (error) {
      alert(`请求出错: ${error}`);
    }
  };

  // 删除成员
  const handleDelMember = async (delWgnum: number) => {
    try {
      const data = await fetchHandleRoom("delMember", delWgnum);
      if (data.code === 0) {
        setStatus("member");
      } else {
        alert(data.msg);
      }
    } catch (error) {
      alert(`请求出错: ${error}`);
    }
  };

  function getColor(latency: number) {
    if (latency < 80) return "#04f504";
    else if (latency < 160) return "#ffa524";
    else return "#ff3b3b";
  }

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

            <ModalBody>
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
                  joinOnClose();
                }}
                mr={5}
              >
                加入
              </Button>
              <Button
                bgColor="#d42424"
                onClick={() => {
                  setInputWgnum(0);
                  joinOnClose();
                }}
              >
                取消
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Heading my={3}>请选择操作</Heading>

        <VStack spacing={6} alignItems="center">
          <Button
            h="50px"
            fontSize="25px"
            // bgColor="#2383c2"
            onClick={handleCreateRoom}
          >
            创建房间
          </Button>

          <Button
            h="50px"
            fontSize="25px"
            // bgColor="#3c9aa7"
            onClick={joinOnOpen}
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
        <Modal isOpen={addIsOpen} onClose={addOnClose}>
          <ModalOverlay />
          <ModalContent bgColor="#002f5c">
            <ModalHeader>添加成员</ModalHeader>

            <ModalCloseButton />

            <ModalBody>
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
        <Box>
          <Button bg="transparent" onClick={getRoomData}>
            <Text mr={3}>刷新列表</Text>
            <IoReloadCircle size={30} color="#35c535" />
          </Button>

          {status === "hoster" && (
            <Button
              bg="transparent"
              onClick={addOnopen}
              isDisabled={
                roomInfo && roomInfo.members.length < 6 ? false : true
              }
            >
              <Text mr={3}>
                {roomInfo && roomInfo.members.length < 6
                  ? "添加成员"
                  : "房间已满"}
              </Text>
              <IoMdPersonAdd size={30} color="#35c535" />
            </Button>
          )}
        </Box>

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
          你的编号: {wgnum}
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
      )}

      <Text>{checkText}</Text>

      {status === "none" ? nonePage() : roomPage()}

      <Button
        h="36px"
        w="90px"
        mt={5}
        bgColor="#7242ad"
        fontSize="16px"
        onClick={gameListToggle}
      >
        联机教程
      </Button>

      <Button
        h="36px"
        w="90px"
        mt={3}
        bgColor="#b5352a"
        fontSize="16px"
        onClick={() => setShowTips(!showTips)}
      >
        注意事项
      </Button>

      <Box
        mx={3}
        px={3}
        border="2px" // 边框宽度
        borderColor="#31b8ce" // 边框颜色
        borderRadius="md" // 边框圆角
      >
        <Collapse in={showTips}>
          {tips.map((tip, index) => (
            <Text fontSize="sm" key={index} my={2}>
              <WarningIcon mr={2} />
              {tip}
            </Text>
          ))}
        </Collapse>
      </Box>
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
    if (status === "未连接") return "#a72f1d";
    else if (status === "待加入") return "#b8670f";
    else return "#1a9225";
  }
  const sortedList = roomInfo.members.sort((a, b) => {
    return a.wgnum - b.wgnum; // 按编号从小到大往下排
  });

  return (
    <Center>
      <TableContainer>
        <Table variant="striped" colorScheme="transparent">
          <Thead position="sticky" top={0} bg="#3e4e63">
            <Tr>
              <Th color="white" fontSize="md" p={3}>
                身份
              </Th>
              <Th color="white" fontSize="md" p={3}>
                编号
              </Th>
              <Th color="white" fontSize="md" p={3}>
                IP
              </Th>
              <Th color="white" fontSize="md" p={2}>
                状态
              </Th>
              {isOwner && (
                <Th color="white" fontSize="md" p={3}>
                  移除
                </Th>
              )}
            </Tr>
          </Thead>
          <Tbody>
            {sortedList.map((item) => (
              <Tr key={item.ip}>
                <Td
                  p={3}
                  bg={
                    item.wgnum === roomInfo.hoster_wgnum
                      ? "#cbd100"
                      : "transparent"
                  }
                  color={
                    item.wgnum === roomInfo.hoster_wgnum ? "black" : "white"
                  }
                >
                  {item.wgnum === roomInfo.hoster_wgnum ? "房主" : "成员"}
                </Td>
                <Td p={3}>{item.wgnum}</Td>
                <Td p={3}>{item.ip}</Td>
                <Td p={2} bg={getColor(item.status)}>
                  {item.status}
                </Td>
                {isOwner && (
                  <Td p={0}>
                    <Button
                      bg="transparent"
                      h={1}
                      hidden={item.wgnum === roomInfo.hoster_wgnum}
                      onClick={() => onDelete(item.wgnum)}
                    >
                      <FiDelete size={30} color="#d83636" />
                    </Button>
                  </Td>
                )}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Center>
  );
}
