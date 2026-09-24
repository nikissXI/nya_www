import { Flex, Heading, Text, Input, Box } from "@chakra-ui/react";
import { Button } from "@/components/universal/button";
import { INPUT_STYLE } from "@/components/universal/ui";
import { useState } from "react";
import { ApiError } from "@/utils/api";
import { api } from "@/utils/endpoints";

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
      const { msg } = await api.escapistsHelper(normalizedIp);
      setShowText(msg ?? "响应结果异常，请联系服主");
    } catch (err) {
      setShowText(
        err instanceof ApiError && err.status !== null
          ? err.message
          : "网络请求失败，请检查网络后重试",
      );
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <Box p={3} bg="bg.subtle" border="1px solid" borderColor="border.line" borderRadius="control">
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
          {...INPUT_STYLE}
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
          _placeholder={{ fontSize: "13px" }}
        />
      </Flex>

      {showText && (
        <Text mt={2} color="warning.text" fontSize="sm" role="status">
          {showText}
        </Text>
      )}
    </Box>
  );
}
