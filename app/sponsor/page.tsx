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
  TextProps,
  List,
  ListItem,
  ListIcon,
} from "@chakra-ui/react";
import { openToast } from "@/components/universal/toast";
import { useUserStateStore } from "@/store/user-state";
import { FaCode } from "react-icons/fa";
import { RiVipCrownFill, RiMoneyCnyBoxLine } from "react-icons/ri";
const HighLight: React.FC<TextProps> = ({ children, ...props }) => {
  return (
    <Text as="span" color="#ff734f" fontWeight="bold" {...props}>
      {children}
    </Text>
  );
};

interface SponsorItem {
  uid: number;
  username: string;
  sponsorship: number;
}

const Page = () => {
  const [sponsorList, setSponsorList] = useState<SponsorItem[]>([]);

  const { userInfo } = useUserStateStore();

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

        <List spacing={2}>
          <ListItem textAlign="left">
            <ListIcon as={FaCode} />
            喵服由服主一人运营，赞助将帮助喵服持续提供联机服务。服主QQ
            1299577815
          </ListItem>

          <ListItem textAlign="left">
            <ListIcon as={RiVipCrownFill} />
            赞助金额可被系统累计记录并获得赞助者铭牌，并有专用联机节点，累计赞助金额不低于10元可加服主QQ解答使用喵服联机中产生的问题
          </ListItem>

          <ListItem textAlign="left">
            <ListIcon as={RiMoneyCnyBoxLine} />
            <HighLight>
              付款时请务必备注您的喵服UID{" "}
              {userInfo ? `${userInfo.uid}` : `（在我的信息页面查看）`}
              ，不写的话无法记录赞助信息，赞助记录永久有效。
            </HighLight>
            赞助信息由服主手动录入，因此更新有延迟（如果睡了那没办法），如果忘了备注或催录入可以加服主QQ
          </ListItem>
        </List>

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
