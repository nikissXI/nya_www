import React from "react";
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
import { useUserStateStore } from "@/store/user-state";
import { useState } from "react";
import { Button } from "../universal/button";
import { openToast } from "../universal/toast";
import { MdTipsAndUpdates } from "react-icons/md";
import { keyframes } from "@emotion/react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface NodeInfo {
  alias: string;
  ping_host: string;
  sponsor: boolean;
  net: number | null;
  delay: number;
}

// 负载等级判断函数
function getNetBadgeProps(net: number | null) {
  if (net === null) return { colorScheme: "gray" };
  if (net < 50) return { colorScheme: "green" };
  if (net < 90) return { colorScheme: "yellow" };
  return { colorScheme: "red" };
}

function getDelayBadgeProps(delay: number) {
  if (delay > 100) return { colorScheme: "orange" };
  else if (delay > 0) return { colorScheme: "green" };
  else return { colorScheme: "red" };
}
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;
const ServerNodeItem: React.FC<{ node: NodeInfo; selected: boolean }> = ({
  node,
  selected,
}) => {
  const { selectNode, userInfo, selectNodeLock } = useUserStateStore();

  return (
    <Box
      py={2}
      px={4}
      borderRadius="md"
      borderWidth={selected ? 3 : 0}
      bg={node.net === null ? "#404e5d82" : "#28c9ff82"}
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
      <Flex justify="space-between" align="center">
        <Text
          fontWeight="bold"
          fontSize="lg"
          color={node.sponsor ? "#ffd200" : "white"}
        >
          {node.alias}
        </Text>

        {node.net !== null && node.delay ? (
          <Badge colorScheme={getDelayBadgeProps(node.delay).colorScheme}>
            {node.delay}ms
          </Badge>
        ) : (
          <Box animation={`${spin} 1s linear infinite`}>
            <AiOutlineLoading3Quarters size={18} />
          </Box>
        )}

        <Badge colorScheme={getNetBadgeProps(node.net).colorScheme}>
          {node.net === null ? `离线` : `负载${node.net}%`}
        </Badge>
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
  } = useUserStateStore();

  const [disableGetNodeList, setDisableGetNodeList] = useState(false);

  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpanded = () => setIsExpanded((prev) => !prev);

  return (
    <Modal
      isOpen={showNodeListModal}
      onClose={setNodeListModal}
      closeOnOverlayClick={userInfo?.wg_data?.node_alias ? true : false}
      isCentered
    >
      <ModalOverlay />
      <ModalContent bgColor="#274161" maxW="320px" mx={3}>
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

            <Stack spacing={3} mx="auto" my={3} px={4} w="100%">
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
          <Center>
            <Text ml="auto">不知道怎么选择？</Text>

            <Button
              color="#7dd4ff"
              bgColor="transparent"
              onClick={toggleExpanded}
              variant="link"
            >
              {isExpanded ? "点我关闭" : "点我查看"}
            </Button>
          </Center>

          <Collapse in={isExpanded} animateOpacity style={{ width: "100%" }}>
            <List spacing={2}>
              <ListItem textAlign="left">
                <ListIcon as={MdTipsAndUpdates} />
                节点负载越低越好，高负载的节点联机易卡顿
              </ListItem>

              <ListItem textAlign="left">
                <ListIcon as={MdTipsAndUpdates} />
                MS是网络延迟，越低越好，实际游戏联机延迟是双方的延迟相加
              </ListItem>

              <ListItem textAlign="left">
                <ListIcon as={MdTipsAndUpdates} />
                目前只有香港节点支持大陆和海外联机，其他节点海外连不上
              </ListItem>
            </List>
          </Collapse>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
