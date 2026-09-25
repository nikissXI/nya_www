import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  SimpleGrid,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import { FaQq, FaWeixin } from "react-icons/fa";
import { openToast } from "@/components/universal/toast";
import { Card, EmptyState, SectionHeading } from "@/components/universal/ui";
import { getErrorMessage } from "@/utils/strings";
import { useUserStateStore } from "@/store/user-state";
import { api } from "@/utils/endpoints";
import type { SponsorItem } from "@/utils/endpoints";

const AdminQQ = "1299577815";
const AdminWX = "nikissxi";

/** 赞助规则说明（文案保持不变，只调整排版） */
const RULES_TEXT = [
  "如需定制独享节点（50元起/月）可联系服主，房间人数无上限，仅指定用户可建房",
  "累计赞助不少于 10 元，可联系服主获取一对一技术支持",
];

const Page = () => {
  const [sponsorList, setSponsorList] = useState<SponsorItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const userInfo = useUserStateStore((s) => s.userInfo);

  const [uid, setUid] = useState(0);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    async function fetchSponsors() {
      try {
        const data = await api.sponsorList();
        // 过滤出赞助金额不低于50的
        setSponsorList((data ?? []).filter((item) => item.sponsorship >= 50));
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
    const urlUid = urlParams.get("uid");
    const parsedUid = Number(urlUid);

    // APP 内打开时会通过 ?uid=<uid> 传入用户 UID，而无需登录
    if (urlUid && Number.isInteger(parsedUid) && parsedUid > 0) {
      setUid(parsedUid);
    } else if (userInfo) {
      setUid(userInfo.uid);
    }
  }, [userInfo]);

  return (
    <Box maxW="640px" mx="auto" pb={8}>
      <VStack spacing={5} align="stretch">
        <Heading size="lg" textAlign="center">
          感谢赞助者们的支持！
        </Heading>

        {/* 联系服主 */}
        <Card p={4}>
          <Flex
            align={{ base: "flex-start", md: "center" }}
            gap={{ base: 2, md: 4 }}
            flexWrap="wrap"
          >
            <Text fontWeight="700" whiteSpace="nowrap">
              联系服主
            </Text>

            <Text fontSize="sm" color="text.muted">
              <Icon as={FaWeixin} mx={1} color="success.text" />
              {AdminWX}
              <Text as="span" mx={3} color="border.strong">
                |
              </Text>
              <Icon as={FaQq} mx={1} color="brand.text" />
              {AdminQQ}
            </Text>
          </Flex>
        </Card>

        {/* 赞助规则 */}
        <VStack spacing={3} w="100%">
          {RULES_TEXT.map((text) => (
            <Card key={text} p={4}>
              <Text fontSize="sm" color="text.muted" lineHeight="1.8">
                {text}
              </Text>
            </Card>
          ))}

          <Card p={4}>
            <SectionHeading title="赞助专用节点解锁规则" mb={2} />

            <VStack align="stretch" spacing={2}>
              <Text fontSize="sm" color="warning.text" fontWeight="600">
                赞助专用节点房间人数上限 <strong>16人</strong>
              </Text>

              <Text fontSize="sm" color="text.muted" lineHeight="1.8">
                有两种线路的赞助节点：多线、跨境
                <br />
                多线赞助满 <strong>10元</strong> 解锁，国内联机用这种
                <br />
                跨境赞助满 <strong>20元</strong> 解锁，跨境联机用这种
              </Text>

              <Text fontSize="sm" color="warning.text" fontWeight="700">
                只需要房主赞助，成员无需单独赞助
              </Text>

              <Text fontSize="sm" color="text.muted">
                房间内成员的赞助也可以叠加房间人数
              </Text>

              <Text fontSize="sm" color="warning.text" lineHeight="1.8">
                简单点说：多线节点赞助10元房间2人，20元则3人，后续每加10元多1人，16人封顶；跨境节点所需金额翻倍
              </Text>

              <Text fontSize="sm" color="text.muted" lineHeight="1.8">
                计算公式如下
                <br />
                房间人数 = 总赞助金额 <strong>//</strong> 节点解锁金额{" "}
                <strong>+1</strong>
              </Text>
            </VStack>
          </Card>
        </VStack>

        <Button
          colorScheme="orange"
          size="lg"
          mx="auto"
          onClick={openModal}
          px={10}
        >
          查看收款码
        </Button>

        {/* 收款码弹窗 */}
        <Modal isOpen={isModalOpen} onClose={closeModal} size="lg">
          <ModalOverlay />
          <ModalContent mx={4} py={4}>
            <ModalCloseButton />
            <ModalBody mt={4}>
              {/* 备注提醒 */}
              <Box
                mb={4}
                p={3}
                bg="warning.soft"
                border="1px solid"
                borderColor="warning.line"
                borderRadius="control"
              >
                <Text
                  color="warning.text"
                  fontWeight="700"
                  fontSize={{ base: "md", md: "lg" }}
                >
                  ⚠️ 在付款备注中写上喵服UID，否则无法录入
                </Text>

                <Flex
                  align="center"
                  justify="center"
                  mt={3}
                  gap={2}
                  wrap="wrap"
                >
                  <Text
                    fontSize="sm"
                    fontWeight="700"
                    color="text.main"
                    bg="bg.surface"
                    border="1px solid"
                    borderColor="warning.line"
                    px={3}
                    py={1.5}
                    borderRadius="control"
                    className="tabular"
                  >
                    {uid ? `您的UID ${uid}` : `登录后才能查看UID`}
                  </Text>

                  <Button
                    colorScheme="brand"
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
                    isDisabled={!uid}
                  >
                    复制UID
                  </Button>
                </Flex>

                <Text
                  color="warning.text"
                  fontSize="sm"
                  mt={3}
                  lineHeight="1.8"
                >
                  <Text as="span" fontWeight="700">
                    赞助金额由服主手动录入，就是看到了才更新；
                  </Text>
                  如果催录入、漏了备注、无法备注、无法付款等等，请联系服主
                  <br />
                  <Icon as={FaWeixin} mx={1} />
                  {AdminWX}&emsp;
                  <Icon as={FaQq} mx={1} />
                  {AdminQQ}
                </Text>
              </Box>

              <SimpleGrid columns={2} spacing={3}>
                <Box textAlign="center">
                  <Image
                    w="100%"
                    maxW="250px"
                    mx="auto"
                    borderRadius="control"
                    src="/images/sponsor/支付宝收款.webp"
                    alt="支付宝收款"
                  />
                </Box>

                <Box textAlign="center">
                  <Image
                    w="100%"
                    maxW="250px"
                    mx="auto"
                    borderRadius="control"
                    src="/images/sponsor/微信收款.webp"
                    alt="微信收款"
                  />
                </Box>
              </SimpleGrid>
            </ModalBody>
          </ModalContent>
        </Modal>

        {/* 赞助名单 */}
        <Box textAlign="center">
          <Heading size="md" mb={1}>
            赞助名单
          </Heading>
          <Text fontSize="sm" color="text.faint">
            仅列出累计赞助不低于 50 元的用户
          </Text>
        </Box>

        <Card p={0} overflow="hidden">
          <TableContainer maxH="360px" overflowY="auto">
            <Table variant="simple">
              <Thead position="sticky" top={0} bg="bg.subtle">
                <Tr>
                  <Th color="text.muted" fontSize="sm">
                    UID
                  </Th>
                  <Th color="text.muted" fontSize="sm">
                    用户名
                  </Th>
                  <Th color="text.muted" fontSize="sm">
                    金额(元)
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {sponsorList.map((item, index) => (
                  <Tr key={index}>
                    <Td className="tabular">{item.uid}</Td>
                    <Td>{item.username}</Td>
                    <Td className="tabular">{item.sponsorship}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>

          {sponsorList.length === 0 && (
            <EmptyState title="暂无赞助名单" description="名单数据来自服务端" />
          )}
        </Card>
      </VStack>
    </Box>
  );
};

export default Page;
