"use client";

import {
  Center,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import { useEffect, useState, useCallback } from "react";

interface SponsorItem {
  money: string;
  qqnum: number;
}

const Page = () => {
  const [sponsorData, setData] = useState<SponsorItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL; // 从环境变量获取 API 地址
      const response = await fetch(`${apiUrl}/sponsorList`);
      if (!response.ok) {
        throw new Error("获取赞助列表出错");
      }
      const data = await response.json();
      setData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "获取赞助列表出错");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (sponsorData.length === 0) {
      fetchData(); // 只在数据为空时请求
    } else {
      setLoading(false); // 数据已缓存，直接设置加载状态
    }
  }, [fetchData, sponsorData]);

  if (loading) {
    return;
  }

  if (error) {
    return <Center color="red.500">{error}</Center>;
  }

  return (
    <Center>
      <TableContainer maxH="520px" overflowY="auto" overflowX="hidden">
        <Table variant="striped" colorScheme="transparent" w="300px">
          <Thead position="sticky" top={0} bg="#3e4e63">
            <Tr>
              <Th color="white" fontSize="md" w="30%" p={3}>
                金额
              </Th>
              <Th color="white" fontSize="md" w="70%" p={3}>
                QQ
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {sponsorData.map((item, index) => (
              <Tr key={index}>
                <Td p={3}>{item.money} </Td>
                <Td p={3}>{item.qqnum}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Center>
  );
};

export default Page;
