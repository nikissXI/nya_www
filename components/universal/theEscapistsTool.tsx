import { Flex, Heading, Text, Input, Box } from "@chakra-ui/react";
import { Button } from "@/components/universal/button";
import { useState } from "react";
import { getAuthToken } from "@/store/authKey";
import { apiUrl } from "@/utils/api";

export default function TheEscapistsTool() {
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
    <Box p={2} bg="rgba(52, 139, 246, 0.18)" borderRadius="md">
      <Heading size="sm" mb={2} textAlign="center">
        创建搜索任务，不创建搜不到房间
      </Heading>

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
          placeholder="填主机喵服IP 如100.64.0.1"
          aria-label="主机喵服 IP"
          bg="white"
          color="#1a202c"
          borderRadius="md"
          _placeholder={{ color: "#718096" ,fontSize:"13px"}}
        />
      </Flex>

      {showText && (
        <Text mt={2} color="#ffd648" fontSize="sm" role="status">
          {showText}
        </Text>
      )}
    </Box>
  );
}
