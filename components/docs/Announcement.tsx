import NextLink from "next/link";

import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Button,
  Flex,
  Text,
  Link,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Spinner,
  VStack,
  HStack,
  Alert,
  AlertIcon,
  Divider,
  Badge,
} from "@chakra-ui/react";

export type Announcement = {
  // 时间戳（毫秒或秒均可，组件内部会自动处理）
  timestamp: number;
  // 纯文本内容，可能包含换行
  content: string;
};

type Props = {
  // API 地址，默认 /api/announcements
  apiUrl?: string;
  // 可选：外部传入 fetcher（方便测试或替换实现）
  fetcher?: (url: string) => Promise<Announcement[]>;
};

const formatDate = (rawTs: number, short: boolean = false): string => {
  // 支持秒或毫秒
  const ts = rawTs < 1e12 ? rawTs * 1000 : rawTs;
  const d = new Date(ts);

  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const date = d.getDate();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");

  if (short) return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
  else return `${year}年${month}月${date}日 ${hours}:${minutes}`;
};

const defaultFetcher = async (url: string): Promise<Announcement[]> => {
  // const res = await fetch(url);
  // if (!res.ok) {
  //   throw new Error(`请求失败：${res.status}`);
  // }
  // // 假设返回 JSON 数组：[{ timestamp: number, content: string }, ...]
  // return (await res.json()) as Announcement[];
  return [
    {
      timestamp: 1755243000000,
      content:
        "根据运行情况对免费和赞助节点进行了调整，因运营成本问题，赞助节点的最低赞助改为10元（国内BGP网络太贵了）。还有两个新增节点，晚些会增加进去",
    },
  ];
};

export const AnnouncementsModal: React.FC<Props> = ({
  apiUrl = "/api/announcements",
  fetcher = defaultFetcher,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [items, setItems] = useState<Announcement[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetcher(apiUrl);
      // 做一个简单的守护：确保按时间从新到旧排序（如果后端已保证，可省）
      const normalized = [...data].sort((a, b) => b.timestamp - a.timestamp);
      setItems(normalized);
    } catch (err: any) {
      setError(err?.message ?? "加载失败");
      setItems(null);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, fetcher]);

  useEffect(() => {
    // 组件挂载时预加载最新公告（可以改为点击时再加载）
    load();
  }, [load]);

  const newestDateLabel =
    items && items.length > 0 ? formatDate(items[0].timestamp, true) : null;

  return (
    <Box>
      <Box mx={5} color="#ffca3d" fontSize="sm" fontWeight="bold">
        <Flex align="center" wrap="wrap">
          {loading ? (
            <HStack spacing={2}>
              <Spinner size="xs" />
              <Text>正在加载最新公告...</Text>
            </HStack>
          ) : error ? (
            <Text color="red.500">加载公告失败</Text>
          ) : items && items.length > 0 ? (
            <Text noOfLines={1}>公告更新时间 {newestDateLabel}</Text>
          ) : (
            <Text>暂无公告</Text>
          )}

          <Button
            ml={1}
            color="#7dd4ff"
            onClick={onOpen}
            colorScheme="transparent"
            size="sm"
            variant="link"
            _hover={{ textDecoration: "none" }}
          >
            点击查看
          </Button>
        </Flex>

        <Text>
          赞助10元可加服主一对一教学
          <Link
            ml={1}
            as={NextLink}
            href="/sponsor"
            color="#7dd4ff"
            _hover={{ textDecoration: "none" }}
          >
            点击赞助
          </Link>
        </Text>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
        <ModalOverlay />
        <ModalContent bg="#202e4fe0" color="white">
          <ModalHeader>公告</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {loading ? (
              <Flex justify="center" py={6}>
                <Spinner />
              </Flex>
            ) : error ? (
              <Alert status="error" borderRadius="md">
                <AlertIcon />
                <Box>
                  <Text>加载公告失败：{error}</Text>
                  <Text fontSize="sm">请稍后重试或联系管理员。</Text>
                </Box>
              </Alert>
            ) : !items || items.length === 0 ? (
              <Box textAlign="center" py={8}>
                <Text>当前暂无公告。</Text>
              </Box>
            ) : (
              <VStack spacing={4} align="stretch">
                {items.map((it, idx) => (
                  <Box key={`${it.timestamp}-${idx}`} p={3} borderRadius="md">
                    <HStack justify="space-between" mb={2}>
                      <Text fontSize="sm">{formatDate(it.timestamp)}</Text>
                      <Badge colorScheme="green" fontSize="0.7em">
                        #{items.length - idx}
                      </Badge>
                    </HStack>
                    <Divider mb={2} />
                    <Text whiteSpace="pre-wrap" fontSize="sm">
                      {it.content}
                    </Text>
                  </Box>
                ))}
              </VStack>
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={onClose} size="sm">
              关闭
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AnnouncementsModal;
