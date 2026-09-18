import {
  Flex,
  Heading,
  Divider,
  Text,
  Image,
  Input,
  Box,
  VStack,
  HStack,
  Badge,
  Icon,
  Link,
} from "@chakra-ui/react";
import DocBox from "@/components/docs/DocBox";
import BackButton from "@/components/docs/BackButton";
import { MdTipsAndUpdates } from "react-icons/md";

export default function Page() {
  return (
    <DocBox notices={["建议选择带宽不低于0.6M的联机节点，4个人也够用"]}>
      <Text>
        视频教程由B站UP主Winters_Stone1制作
        <Link
          ml={1}
          href="https://www.bilibili.com/video/BV1dZSeBLE4e/"
          color="#7dd4ff"
          target="_blank"
        >
          查看视频
        </Link>
      </Text>

      <Divider my={5} />

      <Text textAlign="center"></Text>

      <Text>喵服以撒的结合交流Q群 1074963191</Text>
      <Text fontSize="sm" color="gray.300" mt={1}>
        联机有问题或找搭子请加群
      </Text>

      <Divider my={5} />

      <Heading size="md">联机步骤</Heading>

      <Text fontSize="sm" my={1} color="gray.300">
        简单的说，玩家都连上喵服，直接联机就行
      </Text>

      <VStack align="stretch" spacing={3}>
        <Box borderLeft="4px solid" borderColor="#7dd4ff" pl={4}>
          <Badge colorScheme="blue" mb={1}>
            第 1 步 · 主机
          </Badge>
          <Text>一名玩家作为主机，创建多人游戏</Text>
        </Box>
        <Box borderLeft="4px solid" borderColor="#7dd4ff" pl={4}>
          <Badge colorScheme="blue" mb={1}>
            第 2 步 · 客机
          </Badge>
          <Text>其他玩家作为客机，通过Steam好友邀请或房间密码都可以</Text>
        </Box>
      </VStack>

      <Divider my={5} />

      <Heading size="md" mb={3}>
        联机还是很卡？
      </Heading>

      <VStack align="stretch" spacing={2}>
        <Text>
          <Icon as={MdTipsAndUpdates} mr={1} />
          这游戏需要所有玩家延迟都低才行，其中一个人卡其他人也会跟着卡，可以尝试调整输入延迟，或把卡比踢了吧（手动狗头）
        </Text>
        <Text>
          <Icon as={MdTipsAndUpdates} mr={1} />
          进以撒群找服主检查联机流量是否走了喵服，有时候流量不走喵服
        </Text>
      </VStack>

      <Divider my={5} />

      <BackButton />
    </DocBox>
  );
}
