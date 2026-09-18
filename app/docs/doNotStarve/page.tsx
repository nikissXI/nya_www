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
  Code,
} from "@chakra-ui/react";
import { MdTipsAndUpdates } from "react-icons/md";
import DocBox from "@/components/docs/DocBox";
import BackButton from "@/components/docs/BackButton";

export default function Page() {
  return (
    <DocBox
      notices={[
        "不支持PC端与移动端联机；安卓可以与苹果联机",
        "2-3人联机时，建议选择带宽不低于0.5M的联机节点，人更多时选择更大带宽节点",
      ]}
    >
      <Text >喵服饥荒联机版交流Q群 641115719</Text>
      <Text fontSize="sm" color="gray.300" mt={1}>
        联机有问题或找搭子请加群
      </Text>

      <Divider my={5} />

      <Heading size="md">联机步骤</Heading>

      <Text fontSize="sm" my={1} color="gray.300">
        端游和手游一样
      </Text>

      <VStack align="stretch" spacing={3}>
        <Box borderLeft="4px solid" borderColor="#7dd4ff" pl={4}>
          <Badge colorScheme="blue" mb={1}>
            第 1 步 · 主机
          </Badge>
          <Text>
            一名玩家作为主机，点击主界面的创建游戏，根据提示生成或选择世界
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
            其他玩家作为客机，点击主界面的浏览游戏，连接类型选LAN
            <br />
            如果能调出控制台，也可以用命令加入，格式如下
            <Code
              display="block"
              whiteSpace="pre-wrap"
              p={1}
              maxW="300px"
              borderRadius="md"
              bg="gray.900"
              color="cyan.200"
              fontSize="sm"
              fontFamily="mono"
            >
              c_connect("主机喵服IP", 10999, "密码")
            </Code>
            比如主机喵服IP是100.64.0.1，密码123
            <Code
              display="block"
              whiteSpace="pre-wrap"
              p={1}
              maxW="300px"
              borderRadius="md"
              bg="gray.900"
              color="cyan.200"
              fontSize="sm"
              fontFamily="mono"
            >
              c_connect("100.64.0.1", 10999, "123")
            </Code>
          </Text>

          <Text fontSize="sm" color="gray.300" mt={2}>
            端游按“~”键打开控制台；原版手游没有控制台，需要第三方版本
          </Text>
          <Text fontSize="sm" color="gray.300" mt={2}>
            iOS的饥荒无法搜索房间，只能通过控制台的命令加入
          </Text>
        </Box>
      </VStack>

      <Divider my={5} />

      <Heading size="md" mb={3}>
        联机失败？按顺序检查
      </Heading>

      <VStack align="stretch" spacing={2}>
        <Text>
          <Icon as={MdTipsAndUpdates} mr={1} />
          游戏版本和模式（在线/离线）要与主机相同，如果安装了模组注意兼容性
        </Text>
        <Text>
          <Icon as={MdTipsAndUpdates} mr={1} />
          手游加入时提示“这个服务器仅允许在相同局域网的玩家连接”，重开游戏再尝试加入（主机和客机都重开试试看）
        </Text>
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
