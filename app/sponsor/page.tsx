import { useEffect, useState } from "react";
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
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Button,
  Heading,
  Flex,
} from "@chakra-ui/react";
import { openToast } from "@/components/universal/toast";
import { getErrorMessage } from "@/utils/strings";
import { FaQq } from "react-icons/fa";
import { useUserStateStore } from "@/store/user-state";
import { FaWeixin } from "react-icons/fa";
import { apiUrl } from "@/utils/api";

interface SponsorItem {
  uid: number;
  username: string;
  sponsorship: number;
}

const Page = () => {
  const [sponsorList, setSponsorList] = useState<SponsorItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { userInfo } = useUserStateStore();

  const [uid, setUid] = useState(0);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    async function fetchSponsors() {
      try {
        const res = await fetch(`${apiUrl}/sponsorList`);
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
          throw new Error(`响应出错 ${data.msg}`);
        }
      } catch (err) {
        openToast({
          content: getErrorMessage(err, "赞助名单加载失败，请稍后再试"),
          status: "error",
        });
      }
    }

    fetchSponsors();
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlUid = urlParams.get("app");
    const parsedUid = Number(urlUid);

    // APP 内打开时会通过 ?app=<uid> 传入用户 UID
    if (urlUid && Number.isInteger(parsedUid) && parsedUid > 0) {
      setUid(parsedUid);
    } else if (userInfo) {
      setUid(userInfo.uid);
    }
  }, [userInfo]);

  return (
    <Box maxW="800px" mx="auto" px={{ base: 4, md: 8 }} pb={8}>
      <VStack spacing={5} align="stretch">
        <Heading size="lg" textAlign="center">
          感谢赞助者们的支持！
        </Heading>

        <Flex
          mx="auto"
          borderRadius="md"
          borderColor="whiteAlpha.300"
          align={{ base: "flex-start", md: "center" }}
          gap={{ base: 2, md: 4 }}
          flexWrap="wrap"
        >
          <Text fontWeight="bold" whiteSpace="nowrap">
            联系服主
          </Text>
          <Text fontSize="sm">
            <Icon as={FaWeixin} mx={1} /> nikissxi
            <Text as="span" mx={3} color="gray.500">
              |
            </Text>
            <Icon as={FaQq} mx={1} /> 1299577815
          </Text>
        </Flex>

        <VStack maxW="600px" spacing={3} mx="auto">
          <Box w="100%" p={4} borderRadius="md" bg="rgba(52, 139, 246, 0.18)">
            <Text fontSize="sm">
              如需定制独享节点（50元起/月）可联系服主，房间人数无上限，仅指定用户可建房
            </Text>
          </Box>

          <Box w="100%" p={4} borderRadius="md" bg="rgba(52, 139, 246, 0.18)">
            <Text fontSize="sm">
              累计赞助不少于 10 元，可联系服主获取一对一技术支持
            </Text>
          </Box>

          <Box w="100%" p={4} borderRadius="md" bg="rgba(52, 139, 246, 0.18)">
            <Text fontWeight="bold" mb={2}>
              赞助专用节点解锁规则
            </Text>
            <Text fontSize="sm">
              普通节点累计赞助满 <strong>10 元</strong>
              即可解锁，跨境节点累计赞助满 <strong>20 元</strong>即可解锁
            </Text>
            <Text fontSize="sm" mt={2}>
              <strong>只需要房主赞助，成员无需单独赞助。</strong>
              房间内成员的赞助也可以计入，累计房间人数
            </Text>
            <Text fontSize="sm" mt={2}>
              房间人数 = 累计赞助金额 ÷ 节点解锁金额 + 1，最多
              <strong>16 人</strong>。
            </Text>
            <Text fontSize="sm" mt={2} color="#ffca3d">
              例：普通节点累计 10 元可容纳 2 人，累计 20 元可容纳 3
              人；跨境节点所需金额翻倍
            </Text>
          </Box>
        </VStack>

        <Button
          colorScheme="orange"
          size="lg"
          mx="auto"
          onClick={openModal}
          mb={2}
        >
          查看收款码
        </Button>

        <Modal isOpen={isModalOpen} onClose={closeModal} size="lg">
          <ModalOverlay />
          <ModalContent bg="#202e4fe0" color="white" mx={5} py={5}>
            <ModalCloseButton />
            <ModalBody mt={4}>
              {/* 备注提醒 */}
              <Box
                mb={4}
                p={3}
                bg="#fff3cd"
                borderRadius="md"
                border="1px solid #ffeeba"
              >
                <Text color="#856404" fontWeight="bold" fontSize="xl">
                  ⚠️ 在付款备注中写上喵服UID，否则无法录入
                </Text>

                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  mt={2}
                >
                  <Text
                    fontSize="lg"
                    fontWeight="bold"
                    color="black"
                    bg="#ffd54e"
                    px={3}
                    py={1}
                    borderRadius="md"
                    mr={2}
                  >
                    {uid ? `您的UID ${uid}` : `登录后才能查看UID`}
                  </Text>

                  <Button
                    colorScheme="blue"
                    size="sm"
                    onClick={() => {
                      if (uid) {
                        navigator.clipboard
                          .writeText(uid.toString())
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
                    disabled={!uid}
                  >
                    复制UID
                  </Button>
                </Box>

                <Text color="#856404" fontSize="sm">
                  <Text as="span" fontWeight="bold">
                    赞助金额由服主手动录入，就是看到了才更新；
                  </Text>
                  如果催录入、漏了备注、无法备注、无法付款等等，请联系服主
                  <br />
                  <Icon as={FaWeixin} mx={1} />
                  nikissxi&emsp;
                  <Icon as={FaQq} mx={1} />
                  1299577815
                </Text>
              </Box>

              <SimpleGrid columns={2} spacing={1}>
                <Box textAlign="center">
                  <Text mb={1}>支付宝</Text>
                  <Image
                    w="100%"
                    maxW="250px"
                    src="/images/sponsor/支付宝收款.webp"
                    alt="支付宝收款"
                  />
                </Box>
                <Box textAlign="center">
                  <Text mb={1}>微信</Text>
                  <Image
                    w="100%"
                    maxW="250px"
                    src="/images/sponsor/微信收款.webp"
                    alt="微信收款"
                  />
                </Box>
              </SimpleGrid>
            </ModalBody>
          </ModalContent>
        </Modal>

        <Box textAlign="center">
          <Heading size="md" mb={1}>
            赞助名单
          </Heading>
          <Text fontSize="sm" color="gray.300">
            仅列出累计赞助不低于 50 元的用户
          </Text>
        </Box>

        <TableContainer maxH="360px" overflowY="auto">
          <Table variant="striped" colorScheme="transparent" w="auto" mx="auto">
            <Thead position="sticky" top={0} bg="#3e4e63">
              <Tr>
                <Th color="white" fontSize="md" p={3}>
                  UID
                </Th>
                <Th color="white" fontSize="md" p={3}>
                  用户名
                </Th>
                <Th color="white" fontSize="md" p={3}>
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
      </VStack>
    </Box>
  );
};

export default Page;
