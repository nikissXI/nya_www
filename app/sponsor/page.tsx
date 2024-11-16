"use client";

import { Box, Text, Image, VStack, Flex, SimpleGrid } from "@chakra-ui/react";

// interface SponsorItem {
//   money: string;
//   qqnum: number;
// }

const Page = () => {
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
          感谢您的支持！
        </Text>

        <Text fontSize="lg">
          喵服目前是由服主一人纯公益运营，您的赞助将帮助喵服持续提供联机服务
        </Text>

        <Text fontSize="md">
          付款时可备注您的喵服账号UID，服主会记录赞助金额。
          如有疑问或其他渠道赞助，请联系服主QQ：1299577815
        </Text>

        <SimpleGrid
          columns={{ base: 2, md: 2 }} // 在移动端一列，桌面端两列
          spacing={1}
        >
          <Image w="200px" src="/images/支付宝收款.jpg" alt="支付宝收款" />
          <Image w="200px" src="/images/微信收款.jpg" alt="微信收款" />
        </SimpleGrid>
      </VStack>
    </Box>
  );
  // const [sponsorData, setData] = useState<SponsorItem[]>([]);
  // const [loading, setLoading] = useState<boolean>(true);
  // const [error, setError] = useState<string | null>(null);
  // const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  // const fetchData = useCallback(async () => {
  //   try {
  //     const resp = await fetch(`${apiUrl}/sponsorList`);
  //     if (!resp.ok) {
  //       throw new Error("获取赞助列表出错");
  //     }
  //     const data = await resp.json();
  //     setData(data);
  //   } catch (err) {
  //     setError(err instanceof Error ? err.message : "获取赞助列表出错");
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [apiUrl]);
  // useEffect(() => {
  //   if (sponsorData.length === 0) {
  //     fetchData(); // 只在数据为空时请求
  //   } else {
  //     setLoading(false); // 数据已缓存，直接设置加载状态
  //   }
  // }, [fetchData, sponsorData]);
  // if (loading) {
  //   return;
  // }
  // if (error) {
  //   return <Center color="red.500">{error}</Center>;
  // }
  // return (
  //   <Center>
  //     <TableContainer maxH="520px" overflowY="auto" overflowX="hidden">
  //       <Table variant="striped" colorScheme="transparent" w="300px">
  //         <Thead position="sticky" top={0} bg="#3e4e63">
  //           <Tr>
  //             <Th color="white" fontSize="md" w="30%" p={3}>
  //               金额
  //             </Th>
  //             <Th color="white" fontSize="md" w="70%" p={3}>
  //               QQ
  //             </Th>
  //           </Tr>
  //         </Thead>
  //         <Tbody>
  //           {sponsorData.map((item, index) => (
  //             <Tr key={index}>
  //               <Td p={3}>{item.money} </Td>
  //               <Td p={3}>{item.qqnum}</Td>
  //             </Tr>
  //           ))}
  //         </Tbody>
  //       </Table>
  //     </TableContainer>
  //   </Center>
  // );
};

export default Page;
