"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { Flex, Image, Center, Text } from "@chakra-ui/react";
import { Button } from "@/components/universal/button";
import { useUserStateStore } from "@/store/user-state";
import { useDisclosureStore } from "@/store/disclosure";

interface CountData {
  viewCount: number;
  userCount: number;
}

export default function Page() {
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const { logined } = useUserStateStore();
  const { onToggle: loginToggle } = useDisclosureStore((state) => {
    return state.modifyLoginDisclosure;
  });
  const [countData, setData] = useState<CountData>({
    viewCount: -1,
    userCount: -1,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const resp = await fetch(`${apiUrl}/countInfo`);
      if (!resp.ok) {
        throw new Error("获取计数信息出错");
      }
      const data = await resp.json();
      setData(data);
      // groupListRef.current = groupArray; // 缓存获取到的游戏数据
    } catch (err) {
      setError(err instanceof Error ? err.message : "获取计数信息出错");
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    if (countData.viewCount === -1) {
      fetchData(); // 只在数据为空时请求
    } else {
      setLoading(false); // 数据已缓存，直接设置加载状态
    }
  }, [fetchData, countData]);

  if (loading) {
    return;
  }

  if (error) {
    return <Center color="red.500">{error}</Center>;
  }

  return (
    <Flex direction="column" justifyContent="space-between" alignItems="center">
      <Flex
        wrap="wrap"
        direction={{ base: "column", md: "row" }}
        justifyContent="center"
        mb={6}
      >
        <Text w="200px" textAlign={{ md: "center" }}>
          网站访问人次： {countData.viewCount}
        </Text>
        <Text w="200px" textAlign={{ md: "center" }}>
          注册用户数量： {countData.userCount}
        </Text>
      </Flex>

      <Center>
        <Image
          src="/images/logo.png"
          alt="logo"
          maxH={{ base: "130px", md: "180px" }}
        />
      </Center>

      <Flex
        wrap="wrap"
        justifyContent="center"
        direction={{ base: "column", md: "row" }}
      >
        <Flex direction="column" mx={3} mt={6} width="230px">
          <Center color="#fb727e" fontSize="lg" fontWeight="bold">
            喵服简介
          </Center>
          <Text fontSize="sm">
            免费提供组网服务，解决异地局域网联机难题，并且支持广播包转发
          </Text>
        </Flex>

        <Flex direction="column" mx={3} mt={6} width="230px">
          <Center color="#fb727e" fontSize="lg" fontWeight="bold">
            适用系统
          </Center>
          <Text fontSize="sm">
            支持安卓、苹果、Win、Mac接入，若游戏支持可实现跨系统联机
          </Text>
        </Flex>
      </Flex>

      <Button
        mt={6}
        fontSize="lg"
        onClick={() => {
          if (logined) {
            router.push("/room");
          } else {
            loginToggle();
          }
        }}
      >
        &gt;&gt; 开始使用 &lt;&lt;
      </Button>
    </Flex>
  );
}
