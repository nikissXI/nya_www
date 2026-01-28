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
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from "@chakra-ui/react";
import { openToast } from "@/components/universal/toast";
import { FaQq } from "react-icons/fa";
import { useUserStateStore } from "@/store/user-state";
import { FaCode } from "react-icons/fa";
import { FaWeixin } from "react-icons/fa";
import { RiVipCrownFill, RiMoneyCnyBoxLine } from "react-icons/ri";
import { IoChatboxEllipsesOutline } from "react-icons/io5";

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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { userInfo } = useUserStateStore();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

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
            (item: SponsorItem) => item.sponsorship >= 50,
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

        {/* <Text fontSize="sm">仅列出赞助不低于50元赞助者，敬请谅解！</Text>

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
        </TableContainer> */}

        <List spacing={2}>
          <ListItem textAlign="left">
            <ListIcon as={FaCode} />
            喵服由服主一人运营，赞助将帮助喵服持续提供联机服务
          </ListItem>

          <ListItem textAlign="left">
            <ListIcon as={RiVipCrownFill} />
            赞助金额可被系统累计记录并获得赞助者铭牌，并有专用联机节点，累计赞助金额不低于10元可加服主QQ解答使用喵服联机中产生的问题
          </ListItem>

          <ListItem textAlign="left">
            <ListIcon as={RiMoneyCnyBoxLine} />
            <HighLight>
              赞助记录永久有效并可累计，解锁的节点不限期不限次使用
            </HighLight>
          </ListItem>

          <ListItem textAlign="left">
            <ListIcon as={IoChatboxEllipsesOutline} />
            有疑问可联系服主&emsp;
            <Icon as={FaWeixin} />
            ：nikissxi&emsp;
            <Icon as={FaQq} />
            ：1299577815
          </ListItem>
        </List>

        <Button colorScheme="orange" size="lg" onClick={openModal} mt={4}>
          查看收款码
        </Button>

        {/* 收款码模态框 */}
        <Modal isOpen={isModalOpen} onClose={closeModal} size="lg">
          <ModalOverlay />
          <ModalContent bgColor="#002f5c">
            <ModalHeader>
              <Text fontSize="xl" fontWeight="bold">
                赞助收款码
              </Text>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {/* 备注提醒 */}
              <Box
                mb={4}
                p={3}
                bg="#fff3cd"
                borderRadius="md"
                border="1px solid #ffeeba"
              >
                <Text color="#856404" fontWeight="bold">
                  ⚠️ 重要提醒：付款时请务必填写备注！
                </Text>
                <Text color="#856404" mt={1}>
                  请在付款备注中填写您的喵服UID：
                </Text>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  mt={2}
                >
                  <Text
                    fontSize="xl"
                    fontWeight="bold"
                    color="black"
                    bg="#ffd54e"
                    px={3}
                    py={1}
                    borderRadius="md"
                    mr={2}
                  >
                    {userInfo ? `${userInfo.uid}` : `（请先登录查看您的UID）`}
                  </Text>
                  <Button
                    colorScheme="blue"
                    size="sm"
                    onClick={() => {
                      if (userInfo?.uid) {
                        navigator.clipboard
                          .writeText(userInfo.uid.toString())
                          .then(() => {
                            openToast({
                              content: "UID已复制到剪贴板",
                              status: "success",
                            });
                          })
                          .catch(() => {
                            openToast({
                              content: "复制失败，请手动复制",
                              status: "error",
                            });
                          });
                      }
                    }}
                    disabled={!userInfo?.uid}
                  >
                    复制UID
                  </Button>
                </Box>
                <Text color="#856404">
                  赞助信息由服主手动录入，因此更新有延迟；如果催录入、漏了备注、无法备注、无法付款等等，请联系服主
                  <br />
                  <Icon as={FaWeixin} />
                  ：nikissxi&emsp;
                  <Icon as={FaQq} />
                  ：1299577815
                </Text>
              </Box>

              {/* 收款二维码 */}
              <SimpleGrid columns={2} spacing={4} justifyContent="center">
                <Box textAlign="center">
                  <Text mb={1}>支付宝</Text>
                  <Image
                    w="250px"
                    src="/images/sponsor/支付宝收款.jpg"
                    alt="支付宝收款"
                  />
                </Box>
                <Box textAlign="center">
                  <Text mb={1}>微信</Text>
                  <Image
                    w="250px"
                    src="/images/sponsor/微信收款.jpg"
                    alt="微信收款"
                  />
                </Box>
              </SimpleGrid>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="gray" onClick={closeModal}>
                关闭
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </VStack>
    </Box>
  );
};

export default Page;
