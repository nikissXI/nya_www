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
} from "@chakra-ui/react";
import { useUserStateStore } from "@/store/user-state";
import { useEffect, useState } from "react";
import { Button } from "../universal/button";
import { openToast } from "../universal/toast";

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

        {node.net !== null && (
          <Badge colorScheme={getDelayBadgeProps(node.delay).colorScheme}>
            {node.delay}ms
          </Badge>
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
    logined,
    getNodeList,
    nodeList,
    showNodeListModal,
    setNodeListModal,
    selectNode,
    userInfo,
  } = useUserStateStore();

  useEffect(() => {
    async function fetchAndHandle() {
      if (logined && userInfo?.wg_data && nodeList === undefined) {
        await getNodeList(); // 等待 getNodeList 执行完
        if (!userInfo?.wg_data?.node_alias) {
          setNodeListModal();
        } else {
          selectNode(userInfo.wg_data.node_alias);
        }
      }
    }
    fetchAndHandle();
  }, [
    logined,
    nodeList,
    selectNode,
    setNodeListModal,
    getNodeList,
    userInfo?.wg_data,
    userInfo?.wg_data?.node_alias,
  ]);

  const [disableGetNodeList, setDisableGetNodeList] = useState(false);

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
                  openToast({
                    content: "刷新节点列表成功",
                    status: "success",
                  });
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
              {nodeList &&
                nodeList.map((node) => (
                  <ServerNodeItem
                    key={node.alias}
                    node={node}
                    selected={
                      userInfo?.wg_data?.node_alias === node.alias
                        ? true
                        : false
                    }
                  />
                ))}
            </Stack>
          </VStack>
        </ModalBody>

        <ModalFooter>
          根据节点负载和延迟选择合适的服务器；MS是延迟，越低越好；大陆联机节点不支持海外用户；
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
