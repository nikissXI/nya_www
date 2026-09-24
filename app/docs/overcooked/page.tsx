import {
  Heading,
  Divider,
  Text,
  Box,
  VStack,
  Badge,
  Icon,
} from "@chakra-ui/react";
import DocBox from "@/components/docs/DocBox";
import BackButton from "@/components/docs/BackButton";
import { MdTipsAndUpdates } from "react-icons/md";

export default function Page() {
  return (
    <DocBox notices={["建议选择带宽不低于0.6M的联机节点，4个人也够用"]}>
      <Text>该游戏玩家群体太小，没有专门的交流群</Text>
      <Text fontSize="sm" color="gray.300" mt={1}>
        联机有问题请去大群找群主
      </Text>

      <Divider my={5} />

      <Heading size="md">联机步骤</Heading>

      <Text fontSize="sm" my={1} color="gray.300">
        简单的说，玩家都连上喵服，直接联机就行，不要开其他加速器
      </Text>

      <VStack align="stretch" spacing={3}>
        <Box borderLeft="4px solid" borderColor="#7ddcff" pl={4}>
          <Badge colorScheme="blue" mb={1}>
            第 1 步 · 主机
          </Badge>
          <Text>一名玩家作为主机，创建多人游戏</Text>
        </Box>
        <Box borderLeft="4px solid" borderColor="#7ddcff" pl={4}>
          <Badge colorScheme="blue" mb={1}>
            第 2 步 · 客机
          </Badge>
          <Text>其他玩家作为客机，通过Steam好友邀请即可</Text>
        </Box>
      </VStack>

      <Divider my={5} />

      <Heading size="md" mb={3}>
        联机还是很卡？
      </Heading>

      <VStack align="stretch" spacing={2}>
        <Text>
          <Icon as={MdTipsAndUpdates} mr={1} />
          进大群找服主检查联机流量是否走了喵服，有时候流量不走喵服
        </Text>
      </VStack>

      <Divider my={5} />

      <BackButton />
    </DocBox>
  );
}
