"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Text,
  Input,
  Modal,
  ModalOverlay,
  Heading,
  Center,
  Stack,
  ModalContent,
  ModalHeader,
  ModalBody,
  Spinner,
  ModalFooter,
  useDisclosure,
  Divider,
  Table,
  Thead,
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
  const [status, setStatus] = useState<"none" | "member" | "hoster">("none");
  const [roomInfo, setRoomData] = useState<RoomInfo | null>(null);
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
  const [refresh, setRefresh] = useState<number>(0); // 用于触发重新请求
  const { isLoggedIn, toggleLogin, wgnum, setWgnum, isLanding, toggleLanding } =
    useAuth();

  useEffect(() => {
    // 如果已登录就拉房间信息
    if (!isLanding && isLoggedIn) {
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
    }
    // 最后设置 loading 状态
    setLoading(false);
  }, [isLanding, isLoggedIn, refresh, status]); // 移除 roomInfo

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
        setRefresh((prev) => prev + 1);
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
        setRefresh((prev) => prev + 1);
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
        setRefresh((prev) => prev + 1);
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
        setRefresh((prev) => prev + 1);
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
        setRefresh((prev) => prev + 1);
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

  // 无状态
  if (status === "none") {
    return (
      <Box textAlign="center">
        <Modal isOpen={joinIsOpen} onClose={joinOnClose}>
          <ModalOverlay />
          <ModalContent>
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
              <Button bgColor="#007bc0" onClick={handleJoinRoom} mr={5}>
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

        <Heading my={6}>请选择操作</Heading>

        <Center>
          <Stack spacing={6}>
            <Button
              h="60px"
              bgColor="#2383c2"
              fontSize="30px"
              onClick={handleCreateRoom}
            >
              创建房间
            </Button>

            <Button
              h="60px"
              bgColor="#753030"
              fontSize="30px"
              onClick={joinOnOpen}
            >
              加入房间
            </Button>
          </Stack>
        </Center>
      </Box>
    );
  }

  return (
    <Box textAlign="center">
      <Modal isOpen={addIsOpen} onClose={addOnClose}>
        <ModalOverlay />
        <ModalContent>
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
        <Button
          bg="transparent"
          onClick={() => {
            setRefresh((prev) => prev + 1); // 更新 refresh 状态以触发请求
          }}
        >
          <Text mr={3}>刷新列表</Text>
          <IoReloadCircle size={30} color="#35c535" />
        </Button>

        {status === "hoster" && (
          <Button
            bg="transparent"
            onClick={addOnopen}
          >
            <Text mr={3}>添加成员</Text>
            <IoMdPersonAdd size={30} color="#35c535" />
          </Button>
        )}
      </Box>
      {/* <Divider my={3} /> */}

      <Button
        h="2.5rem"
        w="7rem"
        mt={3}
        size="lg"
        bg="#8f2424"
        onClick={status === "hoster" ? handleCloseRoom : handleExitRoom}
      >
        {status === "hoster" ? "关闭房间" : "退出房间"}
      </Button>
    </Box>
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
            {roomInfo.members.map((item) => (
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
