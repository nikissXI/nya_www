"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { Button, Flex, Image, Center, Text } from "@chakra-ui/react";

interface CountData {
  viewCount: number;
  userCount: number;
}

const UserProfilePage = () => {
  const router = useRouter();

  const [countData, setData] = useState<CountData>({
    viewCount: -1,
    userCount: -1,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL; // 从环境变量获取 API 地址
      const response = await fetch(`${apiUrl}/countInfo`);
      if (!response.ok) {
        throw new Error("获取计数信息出错");
      }
      const data = await response.json();
      setData(data);
      // groupListRef.current = groupArray; // 缓存获取到的游戏数据
    } catch (err) {
      setError(err instanceof Error ? err.message : "获取计数信息出错");
    } finally {
      setLoading(false);
    }
  }, []);

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
        <Text w="200px">网站访问人次： {countData.viewCount}</Text>
        <Text w="200px">当前用户数量： {countData.userCount}</Text>
      </Flex>
      <Center>
        <Image
          src="images/logo.png"
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
            免费使用
          </Center>
          <Center>
            目前无收费内容，但不保证永久免费，也可能后续没钱倒闭，我不是富豪做不起慈善
          </Center>
        </Flex>

        <Flex direction="column" mx={3} mt={6} width="230px">
          <Center color="#fb727e" fontSize="lg" fontWeight="bold">
            多平台
          </Center>
          <Center>
            支持主流操作系统如安卓、苹果、Windows，若游戏支持可实现跨系统联机
          </Center>
        </Flex>
      </Flex>

      <Button
        color="#80ffaf"
        mt={6}
        bgColor="#2d85c980"
        fontSize="lg"
        onClick={() => {
          router.push("/wgnum"); // 匿名函数路由到 /wgnum
        }}
      >
        &gt;&gt; 点我开始使用 &lt;&lt;
      </Button>
    </Flex>
  );
};

export default UserProfilePage;
