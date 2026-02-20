import {
  Box,
  Flex,
  Text,
  Stack,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  VStack,
  ModalFooter,
  ModalBody,
  Collapse,
  Center,
  List,
  ListItem,
  ListIcon,
  Icon,
  Select,
  SimpleGrid,
} from "@chakra-ui/react";
import { useUserStateStore, NodeInfo } from "@/store/user-state";
import { useState, useEffect, useRef } from "react";
import { Button } from "../universal/button";
import { openToast } from "../universal/toast";
import { MdTipsAndUpdates } from "react-icons/md";
import { keyframes } from "@emotion/react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { MdOutlineSignalCellularAlt } from "react-icons/md";
import { FaServer } from "react-icons/fa6";
import { motion } from "framer-motion";

// 负载等级判断函数
function getNetBadgeProps(net: number) {
  if (net < 50) return { colorScheme: "green" };
  if (net < 85) return { colorScheme: "yellow" };
  return { colorScheme: "red" };
}

function getDelayBadgeProps(delay: number) {
  if (delay < 60) return { colorScheme: "green" };
  else if (delay < 120) return { colorScheme: "yellow" };
  else return { colorScheme: "red" };
}

function getNetTypeBadgeProps(netType: string) {
  if (netType === "多线") return { colorScheme: "orange" };
  else if (netType === "电信") return { colorScheme: "blue" };
  else if (netType === "跨境") return { colorScheme: "yellow" };
  else return { colorScheme: "pink" };
}

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// 排序函数
function sortNodes(
  nodes: NodeInfo[],
  sortBy: string,
  sortOrder: "asc" | "desc",
) {
  return [...nodes].sort((a, b) => {
    if (sortBy === "delay") {
      if (a.delay === undefined) return 1;
      if (b.delay === undefined) return -1;
      return sortOrder === "asc" ? a.delay - b.delay : b.delay - a.delay;
    } else if (sortBy === "net") {
      if (a.net === null) return 1;
      if (b.net === null) return -1;
      return sortOrder === "asc" ? a.net - b.net : b.net - a.net;
    } else if (sortBy === "bandwidth") {
      const bwA = a.bandwidth || 0;
      const bwB = b.bandwidth || 0;
      return sortOrder === "asc" ? bwA - bwB : bwB - bwA;
    } else if (sortBy === "alias") {
      return sortOrder === "asc"
        ? a.alias.localeCompare(b.alias)
        : b.alias.localeCompare(a.alias);
    }
    return 0;
  });
}

// 筛选函数
function filterNodes(nodes: NodeInfo[], filterBy: string) {
  return nodes.filter((node) => {
    const matchesFilter = filterBy === "all" || node.net_type === filterBy;
    return matchesFilter;
  });
}

const ServerNodeItem: React.FC<{
  node: NodeInfo;
  selected: boolean;
}> = ({ node, selected }) => {
  const { selectNode, userInfo, selectNodeLock } = useUserStateStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Box
        id={node.alias}
        py={1}
        px={3}
        borderRadius="lg"
        border={selected ? "2px solid" : "1px solid rgba(255, 255, 255, 0.1)"}
        bgColor={
          selected ? "rgba(255, 137, 0, 0.2)" : "rgba(255, 255, 255, 0.05)"
        }
        borderColor={
          selected ? "rgba(255, 117, 12, 0.6)" : "rgba(255, 255, 255, 0.1)"
        }
        boxShadow={
          selected
            ? "0 0 3px 3px rgba(255, 174, 0, 0.6), 0 0 5px 5px rgba(255, 243, 20, 0.4)"
            : "0 2px 4px rgba(0, 0, 0, 0.1)"
        }
        onClick={async () => {
          if (node.net === null || selectNodeLock === true) return;
          if (node.alias === userInfo?.wg_data?.node_alias) {
            openToast({
              content: "已经在使用该节点",
              status: "info",
            });
            return;
          }

          selectNode(node.alias, true);
        }}
        _hover={{
          bgColor: selected
            ? "rgba(255, 137, 0, 0.2)"
            : "rgba(255, 255, 255, 0.1)",
          boxShadow: selected
            ? "0 0 3px 3px rgba(255, 174, 0, 0.6), 0 0 5px 5px rgba(255, 243, 20, 0.4)"
            : "0 4px 8px rgba(0, 0, 0, 0.2)",
        }}
        cursor="pointer"
      >
        <Flex justify="space-between" align="flex-start">
          <Box>
            <Flex align="center">
              <Text
                fontWeight="bold"
                fontSize="lg"
                color={node.sponsor ? "#ffd200" : "white"}
                mr={2}
              >
                {node.alias}
              </Text>
              {node.net !== null ? (
                <>
                  <Badge
                    colorScheme={
                      getNetTypeBadgeProps(node.net_type).colorScheme
                    }
                    fontSize="xs"
                  >
                    {node.net_type}
                  </Badge>
                  <Badge colorScheme="teal" fontSize="xs" mx={1}>
                    {node.bandwidth}M
                  </Badge>
                </>
              ) : (
                <Badge colorScheme="gray" fontSize="xs">
                  离线
                </Badge>
              )}
            </Flex>
          </Box>
        </Flex>

        <SimpleGrid
          columns={2}
          spacing={4}
          display={node.net !== null ? "grid" : "none"}
          mt={1}
        >
          <Box textAlign="center">
            <Flex align="center" justify="center">
              <MdOutlineSignalCellularAlt size={16} color="#7dd4ff" />
              <Text ml={1} fontSize="sm" color="gray.300">
                延迟
              </Text>
            </Flex>
            {node.net !== null &&
              (node.delay !== undefined ? (
                <Box>
                  <Text
                    fontSize="lg"
                    fontWeight="bold"
                    color={
                      getDelayBadgeProps(node.delay).colorScheme === "green"
                        ? "green.400"
                        : getDelayBadgeProps(node.delay).colorScheme ===
                            "yellow"
                          ? "yellow.400"
                          : "red.400"
                    }
                  >
                    {node.delay}ms
                  </Text>
                </Box>
              ) : (
                <Box display="flex" justifyContent="center" alignItems="center">
                  <Box
                    display="flex"
                    justifyContent="center"
                    animation={`${spin} 1s linear infinite`}
                    transformOrigin="center center"
                  >
                    <AiOutlineLoading3Quarters size={12} />
                  </Box>
                </Box>
              ))}
          </Box>

          <Box textAlign="center">
            <Flex align="center" justify="center">
              <FaServer size={16} color="#7dd4ff" />
              <Text ml={1} fontSize="sm" color="gray.300">
                负载
              </Text>
            </Flex>
            {node.net !== null && (
              <Box>
                <Text
                  fontSize="lg"
                  fontWeight="bold"
                  color={
                    getNetBadgeProps(node.net).colorScheme === "green"
                      ? "green.400"
                      : getNetBadgeProps(node.net).colorScheme === "yellow"
                        ? "yellow.400"
                        : "red.400"
                  }
                >
                  {node.net}%
                </Text>
              </Box>
            )}
          </Box>
        </SimpleGrid>
      </Box>
    </motion.div>
  );
};

export const ServerNodeListModal: React.FC = () => {
  const {
    nodeReady,
    getNodeList,
    nodeMap,
    showNodeListModal,
    setNodeListModal,
    userInfo,
    setNodeReady,
  } = useUserStateStore();

  const [disableGetNodeList, setDisableGetNodeList] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpanded = () => setIsExpanded((prev) => !prev);
  const [sortBy, setSortBy] = useState("delay");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filterBy, setFilterBy] = useState("all");
  // const nodeListRef = useRef<HTMLDivElement>(null);

  const Suggestions = [
    "线路选择指南：多线 - 适合中国大陆任意网络；电信 - 适合电信宽带或流量上网；跨境 - 适合跨中国大陆（即国内和国外）联机；海外 - 除中国大陆外都适合",
    "负载值解读：负载越低节点越流畅，高峰期可能拥挤导致卡顿，追求稳定可选择金色的赞助节点",
    "带宽选择：M表示Mbps，每个用户可使用的最高网络带宽。大部分游戏1M足够，联机人数多时建议选择更大带宽的节点",
    "延迟说明：网络延迟越低越好，单位是毫秒(ms)。实际游戏联机延迟是主机与客机延迟的总和",
    "选择建议：优先选择延迟低、负载小、带宽足够的节点，根据您的网络环境选择合适的线路类型",
  ];

  // 处理节点数据
  const nodes = nodeMap ? Array.from(nodeMap.values()) : [];
  const filteredNodes = filterNodes(nodes, filterBy);
  const sortedNodes = sortNodes(filteredNodes, sortBy, sortOrder);

  // 自动滚动到选中节点
  useEffect(() => {
    if (showNodeListModal && nodeReady && userInfo?.wg_data?.node_alias) {
      const selectedNodeId = userInfo.wg_data.node_alias;
      setTimeout(() => {
        const nodeElement = document.getElementById(selectedNodeId);
        if (nodeElement) {
          nodeElement.scrollIntoView({ behavior: "smooth", block: "center" });
          setNodeReady(false);
        }
      }, 100); // 延迟执行，确保DOM已经渲染完成
    }
  }, [
    showNodeListModal,
    nodeReady,
    userInfo?.wg_data?.node_alias,
    setNodeReady,
  ]);

  // 获取所有网络类型
  const netTypes = [
    "all",
    ...Array.from(new Set(nodes.map((node) => node.net_type))),
  ];

  return (
    <Modal
      isOpen={showNodeListModal}
      onClose={setNodeListModal}
      closeOnOverlayClick={userInfo?.wg_data?.node_alias ? true : false}
      isCentered
    >
      <ModalOverlay />
      <ModalContent
        bgColor="#3b4960e3"
        maxW={{ base: "90vw", md: "360px" }}
        py={4}
      >
        <ModalBody>
          <VStack spacing={2} align="stretch">
            <Flex flexDirection="column" gap={3} width="100%">
              <Flex justify="center" gap={4} width="100%">
                <Button
                  size="sm"
                  onClick={async () => {
                    if (disableGetNodeList === true) return;

                    setDisableGetNodeList(true);
                    setTimeout(() => {
                      setDisableGetNodeList(false);
                    }, 3000);

                    await getNodeList();
                  }}
                  disabled={disableGetNodeList}
                  flex="1"
                >
                  刷新列表
                </Button>

                <Button
                  size="sm"
                  onClick={() => {
                    if (!userInfo?.wg_data?.node_alias) {
                      openToast({
                        content: "选择节点后才能关闭",
                        status: "warning",
                      });
                      return;
                    }

                    setNodeListModal();
                  }}
                  bgColor="#be2b2b"
                  flex="1"
                >
                  关闭窗口
                </Button>
              </Flex>

              <Flex justify="center" gap={4} width="100%">
                <Flex align="center" flex="1">
                  <Select
                    size="sm"
                    value={sortBy}
                    onChange={(e) => {
                      const newSortBy = e.target.value;
                      setSortBy(newSortBy);
                      // 当选择带宽优先时，自动设置为降序，确保带宽大的排在前面
                      if (newSortBy === "bandwidth") {
                        setSortOrder("desc");
                      } else {
                        setSortOrder("asc");
                      }
                    }}
                    bgColor="rgba(255, 255, 255, 0.05)"
                    borderColor="rgba(255, 255, 255, 0.1)"
                    borderRadius="lg"
                    color="white"
                    width="100%"
                    _focus={{
                      borderColor: "#7dd4ff",
                      boxShadow: "0 0 0 1px #7dd4ff",
                    }}
                    _hover={{
                      borderColor: "rgba(255, 255, 255, 0.3)",
                    }}
                  >
                    <option
                      value="delay"
                      style={{ backgroundColor: "#3b4960", color: "white" }}
                    >
                      延迟优先排序
                    </option>
                    <option
                      value="net"
                      style={{ backgroundColor: "#3b4960", color: "white" }}
                    >
                      负载优先排序
                    </option>
                    <option
                      value="bandwidth"
                      style={{ backgroundColor: "#3b4960", color: "white" }}
                    >
                      带宽优先排序
                    </option>
                    <option
                      value="alias"
                      style={{ backgroundColor: "#3b4960", color: "white" }}
                    >
                      节点名称排序
                    </option>
                  </Select>
                </Flex>

                <Flex align="center" flex="1">
                  <Select
                    size="sm"
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value)}
                    borderRadius="lg"
                    bgColor="rgba(255, 255, 255, 0.05)"
                    borderColor="rgba(255, 255, 255, 0.1)"
                    color="white"
                    width="100%"
                    _focus={{
                      borderColor: "#7dd4ff",
                      boxShadow: "0 0 0 1px #7dd4ff",
                    }}
                    _hover={{
                      borderColor: "rgba(255, 255, 255, 0.3)",
                    }}
                  >
                    {netTypes.map((type) => (
                      <option
                        key={type}
                        value={type}
                        style={{ backgroundColor: "#3b4960", color: "white" }}
                      >
                        {type === "all" ? "筛选线路" : type}
                      </option>
                    ))}
                  </Select>
                </Flex>
              </Flex>
            </Flex>

            {!userInfo?.wg_data?.node_alias && (
              <Text fontSize="sm" align="center" color="#ffca3d">
                请选择一个节点，点击节点名称即可
                <br />
                如果不会选，窗口底部有节点选择建议
              </Text>
            )}

            <Stack
              spacing={3}
              mx="auto"
              p={2}
              w="100%"
              maxH={isExpanded ? "30vh" : "60vh"}
              overflowY="auto"
              borderRadius="lg"
            >
              {sortedNodes.length > 0 ? (
                sortedNodes.map((node) => (
                  <ServerNodeItem
                    key={node.alias}
                    node={node}
                    selected={userInfo?.wg_data?.node_alias === node.alias}
                  />
                ))
              ) : (
                <Box textAlign="center" py={10}>
                  <Text color="gray.400">未找到匹配的节点</Text>
                </Box>
              )}
            </Stack>
          </VStack>
        </ModalBody>

        <ModalFooter py={0} flexDirection="column">
          <Text fontSize="sm">
            点击选择联机节点，不会选看讲解
            <Button
              ml={1}
              color="#7dd4ff"
              bgColor="transparent"
              onClick={toggleExpanded}
              variant="link"
              fontSize="sm"
            >
              {isExpanded ? "收起讲解" : "查看讲解"}
            </Button>
          </Text>

          <Collapse in={isExpanded} animateOpacity>
            <List
              maxH="30vh"
              overflowY="auto"
              spacing={3}
              mt={2}
              p={4}
              borderRadius="lg"
              bgColor="rgba(255, 255, 255, 0.05)"
              border="1px solid rgba(255, 255, 255, 0.1)"
            >
              {Suggestions.map((suggestion, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <ListItem>
                    <Text color="gray.200" fontSize="sm" mt={1}>
                      <ListIcon as={MdTipsAndUpdates} color="#7dd4ff" />
                      {suggestion}
                    </Text>
                  </ListItem>
                </motion.div>
              ))}
            </List>
          </Collapse>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
