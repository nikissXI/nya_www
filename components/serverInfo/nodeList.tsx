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
  ModalHeader,
  ModalFooter,
  ModalBody,
  Collapse,
  Center,
  List,
  ListItem,
  ListIcon,
} from "@chakra-ui/react";
import { useUserStateStore, NodeInfo } from "@/store/user-state";
import { useState, useEffect } from "react";
import { Button } from "../universal/button";
import { openToast } from "../universal/toast";
import { MdTipsAndUpdates } from "react-icons/md";
import { keyframes } from "@emotion/react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

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
  else return { colorScheme: "pink" };
}

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;
const ServerNodeItem: React.FC<{
  node: NodeInfo;
  selected: boolean;
}> = ({ node, selected }) => {
  const { selectNode, userInfo, selectNodeLock } = useUserStateStore();

  return (
    <Box
      py={1}
      pl={2}
      borderRadius="md"
      border={selected ? "2px solid" : "0"}
      bgColor={selected ? "rgba(255, 137, 0, 0.2)" : ""}
      borderColor="rgba(255, 117, 12, 0.6)"
      boxShadow={
        selected
          ? "0 0 3px 3px rgba(255, 174, 0, 0.6), 0 0 5px 5px rgba(255, 243, 20, 0.4)"
          : ""
      }
      // bg={node.net === null ? "#404e5d82" : "#28c9ff82"}
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
    >
      <Flex width="100%">
        <Box flex="1 1 0" minWidth={0}>
          <Text
            textAlign="center"
            fontWeight="bold"
            fontSize="lg"
            color={node.sponsor ? "#ffd200" : "white"}
          >
            {node.alias}
          </Text>

          <Flex justify="space-between" align="center">
            <Badge
              colorScheme={getNetTypeBadgeProps(node.net_type).colorScheme}
              ml={1}
            >
              {node.net_type}
            </Badge>

            <Badge colorScheme="teal" mr={1} px={1.5}>
              {node.bandwidth}M
            </Badge>
          </Flex>
        </Box>

        <Box flex="1 1 0" minWidth={0}>
          {node.net !== null &&
            (node.delay !== undefined ? (
              <Badge
                width="80%"
                borderRadius="md"
                fontSize="md"
                colorScheme={getDelayBadgeProps(node.delay).colorScheme}
                lineHeight="1.1"
                py={1}
                textTransform="none"
              >
                延迟
                <br />
                {node.delay}ms
              </Badge>
            ) : (
              <Box
                display="flex"
                justifyContent="center"
                animation={`${spin} 1s linear infinite`}
                transformOrigin="center center"
              >
                <AiOutlineLoading3Quarters size={18} />
              </Box>
            ))}
        </Box>

        <Box flex="1 1 0" minWidth={0}>
          {node.net !== null ? (
            <Badge
              width="80%"
              borderRadius="md"
              fontSize="md"
              colorScheme={getNetBadgeProps(node.net).colorScheme}
              lineHeight="1.1"
              py={1}
            >
              负载
              <br />
              {node.net}%
            </Badge>
          ) : (
            <Badge
              width="80%"
              borderRadius="md"
              fontSize="lg"
              colorScheme="gray"
            >
              离线
            </Badge>
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export const ServerNodeListModal: React.FC = () => {
  const {
    getNodeList,
    nodeMap,
    showNodeListModal,
    setNodeListModal,
    userInfo,
    selectNode,
  } = useUserStateStore();

  useEffect(() => {
    // 设置每分钟执行一次
    const intervalId = setInterval(() => {
      if (userInfo?.wg_data?.node_alias)
        selectNode(userInfo.wg_data.node_alias, false);
    }, 1800 * 1000);
    // 组件卸载时清除定时器
    return () => clearInterval(intervalId);
  }, [userInfo, selectNode]);

  const [disableGetNodeList, setDisableGetNodeList] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpanded = () => setIsExpanded((prev) => !prev);

  const Suggestions = [
    "注意！因政策原因，中国大陆与境外联机只能用香港A节点，只有香港A节点是全球任意地区均可连接",
    "线路区别：多线 - 中国大陆任意网络使用；电信 - 中国大陆电信网络使用；海外 - 非中国大陆均可使用",
    "M是指Mbps，即每个用户可使用的最高网络带宽，如果联机人数多起来后开始卡，试试换更大带宽的节点",
    "负载越低越好，高负载的节点联机易卡顿，每30秒更新一次",
    "网络延迟越低越好，ms是毫秒，实际游戏联机延迟是主机+客机的延迟总和",
  ];

  return (
    <Modal
      isOpen={showNodeListModal}
      onClose={setNodeListModal}
      closeOnOverlayClick={userInfo?.wg_data?.node_alias ? true : false}
      isCentered
    >
      <ModalOverlay />
      <ModalContent bgColor="#3b4960e3" maxW="320px" mx={3}>
        <ModalHeader textAlign="center">点击选择联机节点</ModalHeader>

        <ModalBody py={0} textAlign="center">
          <VStack spacing={2} align="stretch">
            <Flex>
              <Button
                size="sm"
                mx="auto"
                onClick={async () => {
                  if (disableGetNodeList === true) return;

                  setDisableGetNodeList(true);
                  // 设置定时器，3秒后重新启用按钮
                  setTimeout(() => {
                    setDisableGetNodeList(false); // 启用按钮
                  }, 3000);

                  await getNodeList();
                }}
              >
                刷新列表
              </Button>

              <Button
                size="sm"
                mx="auto"
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
              >
                关闭窗口
              </Button>
            </Flex>

            <Stack
              spacing={2}
              mx="auto"
              mb={3}
              p={2}
              w="100%"
              maxH="40vh"
              overflowY="auto"
            >
              {nodeMap &&
                Array.from(nodeMap.values()).map((node) => (
                  <ServerNodeItem
                    key={node.alias}
                    node={node}
                    selected={userInfo?.wg_data?.node_alias === node.alias}
                  />
                ))}
            </Stack>
          </VStack>
        </ModalBody>

        <ModalFooter pt={0} flexDirection="column">
          <List spacing={0}>
            <ListItem textAlign="left">
              <ListIcon as={MdTipsAndUpdates} />
              中国大陆跨境联机用香港A
            </ListItem>
            <ListItem textAlign="left">
              <ListIcon as={MdTipsAndUpdates} />
              广州C非电信网络容易卡顿
            </ListItem>
          </List>

          <Center>
            <Button
              color="#7dd4ff"
              bgColor="transparent"
              onClick={toggleExpanded}
              variant="link"
            >
              {isExpanded ? "点我关闭" : "点我查看更多"}
            </Button>
          </Center>

          <Collapse in={isExpanded} animateOpacity style={{ width: "100%" }}>
            <List spacing={2}>
              {Suggestions.map((suggestion, index) => (
                <ListItem key={index} textAlign="left">
                  <ListIcon as={MdTipsAndUpdates} />
                  {suggestion}
                </ListItem>
              ))}
            </List>
          </Collapse>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
