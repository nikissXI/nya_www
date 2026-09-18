import {
  Flex,
  Heading,
  Divider,
  Text,
  Image,
  Input,
  Box,
  VStack,
  HStack,
  Badge,
  Icon,
  Link,
} from "@chakra-ui/react";
import { Button } from "@/components/universal/button";
import { useState } from "react";
import { useUserStateStore } from "@/store/user-state";
import { getAuthToken } from "@/store/authKey";
import { MdTipsAndUpdates } from "react-icons/md";
import BackButton from "@/components/docs/BackButton";
import DocBox from "@/components/docs/DocBox";
import { apiUrl } from "@/utils/api";

export default function AndroidPage0() {
  const { userInfo, setShowLoginModal } = useUserStateStore();
  const [inputIp, setInputIp] = useState("");
  const [showText, setShowText] = useState("");
  const [isChecking, setIsChecking] = useState(false);

  const createTask = async (hosterIp: string) => {
    const normalizedIp = hosterIp.trim();
    if (!normalizedIp) {
      setShowText("请先输入主机的喵服 IP");
      return;
    }

    setIsChecking(true);

    try {
      const resp = await fetch(
        `${apiUrl}/escapistsHelper?hosterIp=${encodeURIComponent(normalizedIp)}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        },
      );

      if (resp.ok) {
        const data = await resp.json();
        setShowText(data.msg || "响应结果异常，请联系服主");
      } else {
        setShowText("查房服务暂时不可用，请稍后再试");
      }
    } catch {
      setShowText("网络请求失败，请检查网络后重试");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <DocBox
      notices={[
        "支持安卓与苹果联机，需游戏版本一致",
        "建议选择带宽不低于0.6M的联机节点，4个人也够用",
      ]}
    >
      <Text>喵服逃脱者手游交流Q群 961793250</Text>
      <Text fontSize="sm" color="gray.300" mt={1}>
        联机有问题或找搭子请加群
      </Text>

      <Divider my={5} />

      <Heading size="md">联机步骤</Heading>

      <Text my={1} fontSize="sm" color="gray.300">
        连接WiFi才能联机，否则会提示
        <br />
        “你需要网络连接到局域网会话”
      </Text>

      <VStack align="stretch" spacing={3}>
        <Box borderLeft="4px solid" borderColor="#7dd4ff" pl={4}>
          <Badge colorScheme="blue" mb={1}>
            第 1 步 · 主机
          </Badge>
          <Text>一名玩家作为主机，选一个地图创建多人游戏，进入地图里等待</Text>
          <Text fontSize="sm" color="gray.300" mt={1}>
            游戏必须保持在前台，切出游戏外客机就会掉线
          </Text>
        </Box>
        <Box borderLeft="4px solid" borderColor="#7dd4ff" pl={4}>
          <Badge colorScheme="blue" mb={1}>
            第 2 步 · 客机
          </Badge>
          <Text>
            其他玩家作为客机，在下方填写主机的喵服IP创建搜索任务，创建后进游戏，点多人游戏的加入，搜索房间就行
          </Text>
        </Box>
      </VStack>

      <Box
        mt={2}
        p={2}
        bg="rgba(52, 139, 246, 0.18)"
        borderRadius="md"
        maxW="360px"
      >
        <Heading size="sm" mb={2} textAlign="center">
          创建搜索任务（不创建搜不到房间）
        </Heading>
        {userInfo ? (
          <>
            <Flex gap={2}>
              <Button
                size="sm"
                onClick={() => createTask(inputIp)}
                isLoading={isChecking}
                loadingText="创建中"
                flexShrink={0}
              >
                创建
              </Button>

              <Input
                size="sm"
                type="text"
                value={inputIp}
                onChange={(e) => {
                  setInputIp(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isChecking) {
                    createTask(inputIp);
                  }
                }}
                placeholder="填主机喵服ip，如 100.64.0.1"
                aria-label="主机喵服 IP"
                bg="white"
                color="#1a202c"
                borderRadius="md"
                _placeholder={{ color: "#718096" }}
              />
            </Flex>
          </>
        ) : (
          <Button size="sm" onClick={setShowLoginModal}>
            请登录后再操作，点击登录
          </Button>
        )}
        {showText && (
          <Text mt={3} color="#ffd648" fontSize="sm" role="status">
            {showText}
          </Text>
        )}
      </Box>

      <Divider my={5} />

      <Heading size="md" mb={3}>
        联机失败？按顺序检查
      </Heading>

      <VStack align="stretch" spacing={2}>
        <Text>
          <Icon as={MdTipsAndUpdates} mr={1} />
          测试的逃脱者手游为东品代理的版本，安卓1.3.2，苹果版本1.70.2，如果游戏更新了请联系服主测试
        </Text>
        <Text>
          <Icon as={MdTipsAndUpdates} mr={1} />
          加入游戏后提示“此会话已不可用”，两种情况：要么主机切出游戏外，要么双方游戏版本号不一致
        </Text>
      </VStack>

      <Divider my={5} />

      <BackButton />
    </DocBox>
  );
}
