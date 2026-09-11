import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  Heading,
  ModalCloseButton,
  ModalBody,
  VStack,
  List,
  ListItem,
  ListIcon,
} from "@chakra-ui/react";
import { useUserStateStore } from "@/store/user-state";
import { MdTipsAndUpdates } from "react-icons/md";

export default function OfflineReasons() {
  const { showOfflineReasonsModal, setOfflineReasonsModal, userWgInfo } =
    useUserStateStore();

  const OfflineReasons = [
    `隧道名称是否为${userWgInfo?.tunnel_name}，如果不是，到教程导入正确隧道`,
    "隧道必须是自己账号的！不能用其他人给的conf_key/二维码/隧道文件",
    "部分学校的校园网会拦截WG流量，试试流量上网可进行验证",
    "如果是小米/红米设备，记得关掉网络优化，WG配置部署教程里有提及",
    "跨境联机要使用跨境线路的节点，其他节点跨境即使能连上过几天也会被GFW封禁",
    "部分国家无法直接连接喵服（目前已知俄罗斯不行），这种情况请找服主特殊处理",
  ];

  return (
    <Modal isOpen={showOfflineReasonsModal} onClose={setOfflineReasonsModal}>
      <ModalOverlay />
      <ModalContent bg="#202e4ff1" color="white" mx={5} py={5}>
        <ModalHeader>
          <Heading size="lg">自行逐项检查</Heading>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <VStack align="start" spacing={3}>
            <List spacing={5}>
              {OfflineReasons.map((reason, index) => (
                <ListItem key={index} textAlign="left">
                  <ListIcon as={MdTipsAndUpdates} />
                  {reason}
                </ListItem>
              ))}
            </List>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
