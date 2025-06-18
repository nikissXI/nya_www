"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  Image,
  VStack,
  SimpleGrid,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from "@chakra-ui/react";
import { openToast } from "@/components/universal/toast";

interface SponsorItem {
  uid: number;
  username: string;
  sponsorship: number;
}

const Page = () => {
  const [sponsorList, setSponsorList] = useState<SponsorItem[]>([]);

  useEffect(() => {
    async function fetchSponsors() {
      try {
        const res = await fetch("https://nyaapi.nikiss.top/sponsorList");
        if (!res.ok) {
          throw new Error(`请求失败，状态码：${res.status}`);
        }
        const data = await res.json();
        if (data.code === 0 && Array.isArray(data.data)) {
          // 过滤出赞助金额不低于50的
          const filtered = data.data.filter(
            (item: SponsorItem) => item.sponsorship >= 50
          );
          setSponsorList(filtered);
        } else {
          openToast({ content: `响应出错 ${data.msg}`, status: "error" });
        }
      } catch (err) {
        openToast({
          content: (err as Error).message || "请求发生错误",
          status: "error",
        });
      }
    }

    fetchSponsors();
  }, []);

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      mx={5}
    >
      <VStack spacing={3}>
        <Text fontSize="2xl" fontWeight="bold">
          感谢赞助者们的支持！
        </Text>

        <Text fontSize="sm">仅列出赞助不低于50元赞助者，敬请谅解！</Text>

        <TableContainer maxH="240px" overflowY="auto" overflowX="hidden">
          <Table variant="striped" colorScheme="transparent" w="300px">
            <Thead position="sticky" top={0} bg="#3e4e63">
              <Tr>
                <Th color="white" fontSize="md" w="30%" p={3}>
                  UID
                </Th>
                <Th color="white" fontSize="md" w="30%" p={3}>
                  用户名
                </Th>
                <Th color="white" fontSize="md" w="70%" p={3}>
                  金额(元)
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {sponsorList.map((item, index) => (
                <Tr key={index}>
                  <Td p={3}>{item.uid} </Td>
                  <Td p={3}>{item.username} </Td>
                  <Td p={3}>{item.sponsorship}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>

        <Text textAlign="left">
          喵服由服主一人纯公益免费运营，赞助将帮助喵服持续提供联机服务。服主QQ
          1299577815
          <br />
          如果在付款时备注您的喵服账号UID（在我的信息页面查看），赞助金额可被系统记录并获得赞助者铭牌，不备注UID的话无法记录哈。
        </Text>

        <SimpleGrid columns={2} spacing={1}>
          <Image
            w="200px"
            src="/images/sponsor/支付宝收款.jpg"
            alt="支付宝收款"
          />
          <Image w="200px" src="/images/sponsor/微信收款.jpg" alt="微信收款" />
        </SimpleGrid>
      </VStack>
    </Box>
  );
};

export default Page;
