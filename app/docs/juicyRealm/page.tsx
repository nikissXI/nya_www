import {
  Heading,
  Divider,
  Text,
  Image,
  Box,
  VStack,
  Badge,
  Icon,
  Link,
} from "@chakra-ui/react";
import DocBox from "@/components/docs/DocBox";
import BackButton from "@/components/docs/BackButton";
import { MdTipsAndUpdates } from "react-icons/md";

export default function Page() {
  return (
    <DocBox
      notices={[
        "支持安卓、苹果、电脑三端跨平台联机",
        "建议选择带宽不低于0.3M的联机节点",
      ]}
    >
      <Text>喵服恶果之地交流Q群 981282876</Text>
      <Text fontSize="sm" color="gray.300" mt={1}>
        联机有问题或找搭子请加群
      </Text>

      <Divider my={5} />

      <Heading size="md">联机步骤</Heading>

      <Text fontSize="sm" my={1} color="gray.300">
        端游和手游一样操作
      </Text>

      <VStack align="stretch" spacing={3}>
        <Box borderLeft="4px solid" borderColor="#7dd4ff" pl={4}>
          <Badge colorScheme="blue" mb={1}>
            第 1 步 · 主机
          </Badge>
          <Text>
            一名玩家作为主机，进游戏点双人，点创建房间，等待另一名玩家加入
          </Text>
          <Text fontSize="sm" color="gray.300" mt={1}>
            手机或平板做主机时，游戏必须保持在前台，不能锁屏或切到后台
          </Text>
        </Box>

        <Box borderLeft="4px solid" borderColor="#7dd4ff" pl={4}>
          <Badge colorScheme="blue" mb={1}>
            第 2 步 · 客机
          </Badge>
          <Text>
            另一名玩家作为客机，进游戏点双人，点加入房间，如果搜不到房间，填写主机的喵服IP加入游戏
          </Text>
          <Text fontSize="sm" color="gray.300" mt={1}>
            注意填的IP是喵服联机房间上显示的，不是用主机游戏里显示的IP
          </Text>
        </Box>
      </VStack>

      <Divider my={5} />

      <Heading size="md" mb={3}>
        联机失败？
      </Heading>

      <VStack align="stretch" spacing={2}>
        <Text>
          <Icon as={MdTipsAndUpdates} mr={1} />
          如果是Windows做主机，试试关闭防火墙
          <Link
            ml={1}
            href="https://zhuanlan.zhihu.com/p/397675766"
            color="#7dd4ff"
            target="_blank"
          >
            不会关点我
          </Link>
        </Text>
      </VStack>

      <Divider my={5} />

      <BackButton />
    </DocBox>
  );
}
