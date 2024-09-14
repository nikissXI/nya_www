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
  Stack,
  Collapse,
  ModalContent,
  ModalHeader,
  ModalBody,
  Spinner,
  ModalFooter,
  useDisclosure,
  Divider,
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
import { useAuth } from "@/components/universal/AuthContext";
import { FiDelete } from "react-icons/fi";
import { IoMdPersonAdd } from "react-icons/io";
import { IoReloadCircle } from "react-icons/io5";
import { GiNetworkBars } from "react-icons/gi";
import { TbReload } from "react-icons/tb";
import { WarningIcon } from "@chakra-ui/icons";

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
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(true);
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
  const [latencyData, setLatencyData] = useState<LatencyData | null>(null);
  const [checking, setChecking] = useState<boolean>(true);
  const [checkText, setCheckText] = useState<string>("");
  const { isLoggedIn, wgnum, isLanding, glOnOpen } = useAuth();

  const [showTips, setShowTips] = useState(false);

  const tips = [
    "QQ绑定编号后，群昵称会被改成形如“编号（联机IP）”，方便玩家间联机",
    "联机请保持网络流畅，若延迟大于160ms或丢包率大于0代表网络不稳定",
    "如果游戏的创建者把游戏放后台，会导致其他玩家无法搜索和加入游戏",
    "各系统只要连上喵服就能互相通信，但至于游戏能不能联机得看游戏自己支不支持",
    "喵服支持所有可以填IP直连及大部分搜索加入的游戏联机，已知逃脱者这个游戏联机需要另外下载工具，具体看游戏联机教程",
  ];

  const getRoomData = async () => {
    const key = localStorage.getItem("key"); // 替换为你的key名称
    const apiUrl = process.env.NEXT_PUBLIC_API_URL; // 从环境变量获取 API 地址

    fetch(`${apiUrl}/getRoom`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${key}`,
      },
    })
      .then((response) => response.json() as Promise<Response>) // 强制转换为 RoomResponse 类型
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
  };

  const fetchNetworkLatency = useCallback(async (checkType: string) => {
    if (wgnum === 0) {
      return;
    }
    setChecking(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(
      `${apiUrl}/networkCheck?wgnum=${wgnum}&checkType=1`
    );
    if (!response.ok) {
      throw new Error(`访问接口出错: ${response.status}`);
    }
    const result = await response.json();
    if (result.code !== 0) {
      // 未连接
      setLatencyData(null);
    } else {
      // 已连接
      setLatencyData(result.data);

      if (checkType === "long") {
        setCheckText("约10秒后返回详细网络检测结果");
        const response = await fetch(
          `${apiUrl}/networkCheck?wgnum=${wgnum}&checkType=2`
        );
        if (!response.ok) {
          throw new Error(`访问接口出错: ${response.status}`);
        }
        const result = await response.json();
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
    setChecking(false);
  }, [wgnum]);

  useEffect(() => {
    if (wgnum !== 0) {
      const interval = setInterval(getRoomData, 10000); // 每10秒更新一次数据
      return () => clearInterval(interval); // 清理定时器
    }
  }, [wgnum]);

  useEffect(() => {
    // 如果已登录就拉房间信息
    if (wgnum !== 0) {
      getRoomData();
      fetchNetworkLatency("short");
    }
    // 最后设置 loading 状态
    setLoading(false);
  }, [wgnum]);

  const fetchHandleRoom = async (
    handleType: string,
    handleWgnum: number
  ): Promise<HandleRoomResponse> => {
    const key = localStorage.getItem("key");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const response = await fetch(
      `${apiUrl}/handleRoom?handleType=${handleType}&wgnum=${handleWgnum}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${key}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error(`访问接口出错: ${response.status}`);
    }
    return response.json() as Promise<HandleRoomResponse>;
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

  // 登陆中或拉取房间中
  if (isLanding || loading) {
    return (
      <Center>
        <Spinner size="xl" />
      </Center>
    );
  }

  // 没登录就让去登录
  if (!isLoggedIn) {
    return (
      <Center my={10}>
        <Stack>
          <Heading textAlign="center">
            你还没登录
            <br />
            无法使用该功能
          </Heading>
          <Button
            my={5}
            bgColor="#007bc0"
            onClick={() => {
              router.push("/wgnum/bind");
            }}
          >
            点击登录
          </Button>
        </Stack>
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
            <ModalBody>
              <Input
                type="number"
                placeholder="请输入房主编号"
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
                bgColor="#ff5353"
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

        <Stack spacing={6} alignItems="center">
          <Button
            h="50px"
            fontSize="25px"
            bgColor="#2383c2"
            onClick={handleCreateRoom}
          >
            创建房间
          </Button>

          <Button
            h="50px"
            fontSize="25px"
            bgColor="#3c9aa7"
            onClick={joinOnOpen}
          >
            加入房间
          </Button>
        </Stack>
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
                bgColor="#ff5353"
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
          {/* && roomInfo && roomInfo.members.length < 6 */}
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
        {/* <Divider my={3} /> */}

        <Stack alignItems="center">
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
        </Stack>
      </Box>
    );
  }

  return (
    <Stack alignItems="center">
      <Text>在喵服关联群里发“房间”可获取本网页链接</Text>
      {networkUtils(
        wgnum,
        latencyData,
        fetchNetworkLatency,
        checking,
        checkText
      )}
      {status === "none" ? nonePage() : roomPage()}
      <Button
        h="36px"
        w="120px"
        mt={3}
        bgColor="#7242ad"
        fontSize="16px"
        onClick={glOnOpen}
      >
        游戏联机教程
      </Button>
      <Button
        h="36px"
        w="120px"
        mt={3}
        bgColor="#b5352a"
        fontSize="16px"
        onClick={() => setShowTips(!showTips)}
      >
        {showTips ? "隐藏注意事项" : "查看注意事项"}
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
            <Text key={index} mb={2}>
              <WarningIcon mr={2} />
              {tip}
            </Text>
          ))}
        </Collapse>
      </Box>
    </Stack>
  );
}

function networkUtils(
  wgnum: number,
  latencyData: LatencyData | null,
  fetchNetworkLatency: (checkType: string) => {},
  checking: boolean,
  checkText: string
) {
  function getColor(latency: number) {
    if (latency < 80) return "#04f504";
    else if (latency < 160) return "#ffa524";
    else return "#ff3b3b";
  }

  return (
    <>
      <Flex align="center">
        <Text fontSize={18} fontWeight="bold" color="#ffd964">
          你的编号: {wgnum}
        </Text>
        <Text
          fontSize={18}
          mx={3}
          fontWeight="bold"
          color={latencyData ? "#3fdb1d" : "#e60000"}
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
          <Text fontSize={18} fontWeight="normal" color="#49ffb6" ml={2}>
            检测
          </Text>
          <Box animation={checking ? `${spin} 1s linear infinite` : "none"}>
            <TbReload size={18} />
          </Box>
        </Button>
      </Flex>
      <Text>{checkText}</Text>
    </>
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
