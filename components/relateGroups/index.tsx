"use client"

import { useEffect, useState, useCallback } from "react";
import { Flex, Center, Divider } from "@chakra-ui/react";
import { ArrowDownIcon } from "@chakra-ui/icons";
interface GroupItem {
  name: string;
  qq: number;
}

interface GroupData {
  main: GroupItem[];
  relate: GroupItem[];
}

const RelateGroupList = () => {
  const [groupData, setData] = useState<GroupData>({
    main: [],
    relate: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL; // 从环境变量获取 API 地址
      const response = await fetch(`${apiUrl}/relateGroup`);
      if (!response.ok) {
        throw new Error("获取关联群信息出错");
      }
      const data = await response.json();
      setData(data);
      // groupListRef.current = groupArray; // 缓存获取到的游戏数据
    } catch (err) {
      setError(err instanceof Error ? err.message : "获取关联群信息出错");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (groupData.main.length === 0) {
      fetchData(); // 只在数据为空时请求
    } else {
      setLoading(false); // 数据已缓存，直接设置加载状态
    }
  }, [fetchData, groupData]);

  if (loading) {
    return;
    // return <Spinner size="md" />;
  }

  if (error) {
    return <Center color="red.500">{error}</Center>;
  }

  return (
    <Flex direction="column" alignItems="center">
      <Center fontWeight="bold" fontSize="xl" color="#a8d1ff" mb={4}>
        <ArrowDownIcon display={{ base: "flex", md: "none" }} />
        喵服关联QQ群
        <ArrowDownIcon display={{ base: "flex", md: "none" }} />
      </Center>
      {groupData.main.map((group, index) => (
        <Center key={index} mb={2}>
          {group.name} - {group.qq}
        </Center>
      ))}

      <Divider my={2} opacity={0} />

      {groupData.relate.map((group, index) => (
        <Center key={index} mb={2}>
          {group.name} - {group.qq}
        </Center>
      ))}
    </Flex>
  );
};

export default RelateGroupList;
