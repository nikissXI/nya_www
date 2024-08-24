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
  wgnum: number;
}

const Page = () => {
  const [sponsorData, setData] = useState<SponsorItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch("https://nya.nikiss.top/sponsorList");
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
        <Table variant="striped" colorScheme="blue" w="320px">
          <Thead position="sticky" top={0} bg="#3e4e63">
            <Tr>
              <Th color="white" fontSize="md" w="100px" p={3}>
                金额
              </Th>
              <Th color="white" fontSize="md" w="120px" p={3}>
                QQ
              </Th>
              <Th color="white" fontSize="md" w="100px%" p={3}>
                编号
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {sponsorData.map((item, index) => (
              <Tr key={index}>
                <Td p={3}>{item.money} </Td>
                <Td p={3}>{item.qqnum}</Td>
                <Td p={3}>{item.wgnum ? item.wgnum : ""} </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Center>
  );
};

export default Page;
