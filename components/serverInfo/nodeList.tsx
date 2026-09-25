import {
  Badge,
  Box,
  Collapse,
  Flex,
  Icon,
  Input,
  List,
  ListIcon,
  ListItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Select,
  SimpleGrid,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { keyframes } from "@emotion/react";
import { motion } from "framer-motion";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaServer } from "react-icons/fa6";
import { MdOutlineSignalCellularAlt, MdTipsAndUpdates } from "react-icons/md";
import { Button } from "../universal/button";
import { openToast } from "../universal/toast";
import { INPUT_STYLE } from "../universal/ui";
import { useUserStateStore } from "@/store/user-state";
import type { NodeInfo } from "@/utils/endpoints";
import { getNetColor, getNetText, getDelayColor } from "@/utils/strings";

/**
 * 节点选择弹窗
 * ------------------------------------------------------------------
 * 支持排序 / 线路筛选 / 名称搜索，当前使用的节点恒置顶，
 * 故障节点（net === -1）置底且不可点。颜色全部走语义 token。
 */

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

function sortNodes(
  nodes: NodeInfo[],
  sortBy: string,
  sortOrder: "asc" | "desc",
) {
  return [...nodes].sort((a, b) => {
    // 离线节点（net === -1）始终排在后面
    const aOffline = a.net === -1;
    const bOffline = b.net === -1;
    if (aOffline && !bOffline) return 1;
    if (!aOffline && bOffline) return -1;

    if (sortBy === "delay") {
      if (a.delay === undefined) return 1;
      if (b.delay === undefined) return -1;
      return sortOrder === "asc" ? a.delay - b.delay : b.delay - a.delay;
    } else if (sortBy === "net") {
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

function filterNodes(nodes: NodeInfo[], filterBy: string, searchTerm: string) {
  return nodes.filter((node) => {
    const matchesFilter = filterBy === "all" || node.net_type === filterBy;
    const matchesSearch =
      !searchTerm ||
      node.alias.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });
}

const ServerNodeItem: React.FC<{
  node: NodeInfo;
  selected: boolean;
}> = ({ node, selected }) => {
  const selectNode = useUserStateStore((state) => state.selectNode);
  const selectNodeLock = useUserStateStore((state) => state.selectNodeLock);

  const offline = node.net === -1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <Box
        id={node.alias}
        p={3}
        borderRadius="card"
        border="1px solid"
        borderColor={selected ? "brand.solid" : "border.line"}
        bg={selected ? "brand.soft" : "bg.surface"}
        opacity={offline ? 0.55 : 1}
        cursor={offline || selectNodeLock ? "not-allowed" : "pointer"}
        transition="border-color .2s ease, background .2s ease, box-shadow .2s ease"
        _hover={
          offline
            ? undefined
            : {
                borderColor: selected ? "brand.solid" : "border.strong",
                boxShadow: selected
                  ? "0 0 0 3px var(--nya-ring)"
                  : "var(--nya-shadow-card)",
              }
        }
        onClick={() => {
          if (offline || selectNodeLock) return;
          if (selected) {
            openToast({ content: "已经在使用该节点", status: "info" });
            return;
          }
          selectNode(node.alias);
        }}
      >
        <Flex align="center" gap={1.5} wrap="wrap">
          <Text
            fontWeight="700"
            fontSize="md"
            color={node.sponsor ? "warning.text" : "text.main"}
          >
            {node.alias}
          </Text>

          {!offline ? (
            <>
              <Badge bg="bg.subtle" fontSize="xs">
                {node.net_type}
              </Badge>
              <Badge bg="bg.subtle" fontSize="xs">
                {node.bandwidth}M
              </Badge>
              {node.node_desc && (
                <Badge bg="bg.subtle" fontSize="xs">
                  {node.node_desc}
                </Badge>
              )}
            </>
          ) : (
            <Badge bg="danger.soft" color="danger.text" fontSize="xs">
              节点故障，稍等或更换节点
            </Badge>
          )}
        </Flex>

        <SimpleGrid
          columns={2}
          spacing={2}
          mt={2}
          display={offline ? "none" : "grid"}
        >
          <Stat
            icon={MdOutlineSignalCellularAlt}
            label="延迟"
            color={
              node.delay !== undefined
                ? getDelayColor(node.delay)
                : "text.faint"
            }
            value={
              node.delay !== undefined ? (
                <Text as="span" className="tabular">
                  {node.delay}
                  <Text as="span" fontSize="xs" ml="1px">
                    ms
                  </Text>
                </Text>
              ) : (
                <Icon
                  as={AiOutlineLoading3Quarters}
                  boxSize={3.5}
                  animation={`${spin} 1s linear infinite`}
                  color="text.faint"
                />
              )
            }
          />

          <Stat
            icon={FaServer}
            label="负载"
            color={getNetColor(node.net)}
            value={getNetText(node.net)}
          />
        </SimpleGrid>
      </Box>
    </motion.div>
  );
};

/** 节点卡片里的一个指标（延迟 / 负载） */
function Stat({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ComponentType;
  label: string;
  value: React.ReactNode;
  color: string;
}) {
  return (
    <Flex direction="column" align="center" justify="center" gap={0.5}>
      <Flex align="center" gap={1} color="text.faint">
        <Icon as={icon} boxSize={4} />
        <Text fontSize="xs">{label}</Text>
      </Flex>

      <Text fontSize="lg" fontWeight="700" lineHeight="1.2" color={color}>
        {value}
      </Text>
    </Flex>
  );
}

export default function ServerNodeListModal() {
  const getNodeListLock = useUserStateStore((state) => state.getNodeListLock);
  const getNodeList = useUserStateStore((state) => state.getNodeList);
  const nodeMap = useUserStateStore((state) => state.nodeMap);
  const showNodeListModal = useUserStateStore(
    (state) => state.showNodeListModal,
  );
  const setNodeListModal = useUserStateStore((state) => state.setNodeListModal);
  const userWgInfo = useUserStateStore((state) => state.userWgInfo);
  const fixedNode = useUserStateStore((state) => state.fixedNode);

  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpanded = () => setIsExpanded((prev) => !prev);
  const [sortBy, setSortBy] = useState("delay");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filterBy, setFilterBy] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const nodes = useMemo(
    () => (nodeMap ? Array.from(nodeMap.values()) : []),
    [nodeMap],
  );

  const netTypes = useMemo(
    () => ["all", ...Array.from(new Set(nodes.map((node) => node.net_type)))],
    [nodes],
  );

  // 筛选 + 排序，并把当前使用的节点置顶
  const sortedNodes = useMemo(() => {
    const sorted = sortNodes(
      filterNodes(nodes, filterBy, searchTerm),
      sortBy,
      sortOrder,
    );

    if (!fixedNode) return sorted;
    const idx = sorted.findIndex((node) => node.alias === fixedNode);
    if (idx <= 0) return sorted;

    const [currentNode] = sorted.splice(idx, 1);
    sorted.unshift(currentNode);
    return sorted;
  }, [nodes, filterBy, searchTerm, sortBy, sortOrder, fixedNode]);

  return (
    <Modal
      isOpen={showNodeListModal}
      onClose={setNodeListModal}
      closeOnOverlayClick={userWgInfo ? true : false}
      isCentered
    >
      <ModalOverlay />
      <ModalContent w={{ base: "calc(100% - 24px)", md: "420px" }} mx={3} p={0}>
        <ModalBody p={{ base: 4, md: 5 }}>
          <VStack spacing={3} align="stretch">
            <SimpleGrid columns={3} spacingX={2} spacingY={1.5} width="100%">
              <FilterLabel text="节点排序" />
              <FilterLabel text="线路筛选" />
              <FilterLabel text="节点搜索" />

              <Select
                size="sm"
                value={sortBy}
                onChange={(e) => {
                  const newSortBy = e.target.value;
                  setSortBy(newSortBy);
                  // 带宽优先时自动降序，确保带宽大的排在前面
                  setSortOrder(newSortBy === "bandwidth" ? "desc" : "asc");
                }}
                variant="app"
                h="32px"
              >
                <option value="delay">延迟</option>
                <option value="net">负载</option>
                <option value="bandwidth">带宽</option>
                <option value="alias">名称</option>
              </Select>

              <Select
                size="sm"
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                variant="app"
                h="32px"
              >
                {netTypes.map((type) => (
                  <option key={type} value={type}>
                    {type === "all" ? "所有" : type}
                  </option>
                ))}
              </Select>

              <Input
                size="sm"
                placeholder="名称"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                {...INPUT_STYLE}
                h="32px"
              />
            </SimpleGrid>

            <Text textAlign="center" fontSize="sm" color="text.muted">
              点击选择联机节点
              <Button
                ml={1}
                variant="link"
                size="sm"
                colorScheme="brand"
                onClick={toggleExpanded}
              >
                {isExpanded ? "再点一次收起" : "不会选点我"}
              </Button>
            </Text>

            <Collapse in={isExpanded} animateOpacity>
              <List
                maxH="30vh"
                overflowY="auto"
                spacing={2.5}
                p={3}
                borderRadius="control"
                bg="bg.subtle"
                border="1px solid"
                borderColor="border.line"
              >
                {[
                  "如需独享节点（50元起/月）请联系服主",
                  "线路选择指南：\n多线 - 首选，适合中国大陆任意网络，不含港澳台\n电信 - 适合主客机都是中国电信的用户，其他运营商联机容易卡顿\n跨境 - 适合国内和国外联机，港澳台也算“国外”",
                  "负载解读：\n显示拥挤时联机容易卡顿。追求稳定建议使用赞助专用节点，用的人少基本不挤",
                  "延迟说明：\n网络延迟越低越好，如果不是延迟敏感游戏不必追求低延迟。实际联机延迟=主机延迟+客机延迟",
                  "带宽选择：\n不同游戏所需带宽不一样，对应游戏教程里会给出带宽建议",
                ].map((text) => (
                  <ListItem key={text}>
                    <Flex align="flex-start" gap={2}>
                      <ListIcon
                        as={MdTipsAndUpdates}
                        color="brand.text"
                        mt="3px"
                        flexShrink={0}
                      />
                      <Text
                        color="text.muted"
                        fontSize="sm"
                        whiteSpace="pre-wrap"
                        lineHeight="1.7"
                      >
                        {text}
                      </Text>
                    </Flex>
                  </ListItem>
                ))}
              </List>
            </Collapse>

            <Stack
              spacing={2.5}
              w="100%"
              maxH={isExpanded ? "30vh" : "56vh"}
              overflowY="auto"
              pr={1}
            >
              {sortedNodes.length > 0 ? (
                sortedNodes.map((node) => (
                  <ServerNodeItem
                    key={node.alias}
                    node={node}
                    selected={userWgInfo?.node_alias === node.alias}
                  />
                ))
              ) : (
                <Box textAlign="center" py={10}>
                  <Text color="text.faint" fontSize="sm">
                    未找到匹配的节点
                  </Text>
                </Box>
              )}
            </Stack>

            <Flex justify="center" gap={3} width="100%">
              <Button
                size="sm"
                onClick={async () => {
                  await getNodeList();
                }}
                disabled={getNodeListLock}
                flex="1"
              >
                {getNodeListLock ? "正在加载" : "刷新列表"}
              </Button>

              <Button
                size="sm"
                colorScheme="red"
                onClick={() => {
                  if (!userWgInfo) {
                    openToast({
                      content:
                        "选择节点后才能关闭，如果没有合适的节点，先随便选一个",
                      status: "warning",
                    });
                    return;
                  }

                  setNodeListModal();
                }}
                flex="1"
              >
                关闭窗口
              </Button>
            </Flex>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

const FilterLabel = ({ text }: { text: string }) => (
  <Text fontSize="xs" color="text.faint" fontWeight="600">
    {text}
  </Text>
);
