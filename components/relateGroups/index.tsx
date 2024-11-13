"use client";

import { useEffect, useState, useCallback } from "react";
import { Center, Box, Flex } from "@chakra-ui/react";
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
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [groupData, setData] = useState<GroupData>({
    main: [],
    relate: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const resp = await fetch(`${apiUrl}/relateGroup`);
      if (!resp.ok) {
        throw new Error("获取关联群信息出错");
      }
      const data = await resp.json();
      setData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "获取关联群信息出错");
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    if (groupData.main.length === 0) {
      fetchData(); // 只在数据为空时请求
    } else {
      setLoading(false); // 数据已缓存，直接设置加载状态
    }
  }, [fetchData, groupData]);

  if (loading) {
    return;
  }

  if (error) {
    return <Center color="red.500">{error}</Center>;
  }

  return (
    <Box
      as="footer"
      minW="240px"
      flex={{ base: "none", md: "1" }} // 桌面端占据 1/3 宽度
    >
      <Flex
        justifyContent="space-between"
        direction="column"
        pt={{ base: "5", md: "24" }}
        pb="100px"
        top={0}
        position="sticky"
      >
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

        {groupData.relate.map((group, index) => (
          <Center key={index} mb={2}>
            {group.name} - {group.qq}
          </Center>
        ))}
      </Flex>
    </Box>
  );
};

export default RelateGroupList;
