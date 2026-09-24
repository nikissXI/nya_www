import {
  Heading,
  Divider,
  Text,
  Box,
  VStack,
  Badge,
} from "@chakra-ui/react";
import DocBox from "@/components/docs/DocBox";
import BackButton from "@/components/docs/BackButton";

export default function Page() {
  return (
    <DocBox
      notices={[
        "支持安卓与苹果联机，但仅安卓能搜索房间",
        "不支持电脑端，因为电脑端没有联机模式",
        "建议选择带宽不低于0.3M的联机节点",
      ]}
    >
      <Text>喵服传说法师交流Q群 981286541</Text>
      <Text fontSize="sm" color="gray.300" mt={1}>
        联机有问题或找搭子请加群
      </Text>

      <Divider my={5} />

      <Heading size="md">联机步骤</Heading>

      <Text fontSize="sm" my={1} color="gray.300">
        端游和手游一样，下图用的是安卓版
      </Text>

      <VStack align="stretch" spacing={3}>
        <Box borderLeft="4px solid" borderColor="#7ddcff" pl={4}>
          <Badge colorScheme="blue" mb={1}>
            第 1 步 · 主机
          </Badge>
          <Text>一名玩家作为主机，进游戏创建联机房间，等待另一名玩家加入</Text>
          <Text fontSize="sm" color="gray.300" mt={1}>
            游戏必须保持在前台，不能锁屏或切到后台
          </Text>
        </Box>

        <Box borderLeft="4px solid" borderColor="#7ddcff" pl={4}>
          <Badge colorScheme="blue" mb={1}>
            第 2 步 · 客机
          </Badge>
          <Text>另一名玩家作为客机，进游戏点加入房间搜索即可</Text>
          <Text fontSize="sm" color="gray.300" mt={1}>
            苹果系统无法搜索房间，只能做主机
          </Text>
        </Box>
      </VStack>

      <Divider my={5} />

      <BackButton />
    </DocBox>
  );
}
