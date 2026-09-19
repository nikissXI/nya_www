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
import DocBox from "@/components/docs/DocBox";
import BackButton from "@/components/docs/BackButton";
import { MdTipsAndUpdates } from "react-icons/md";

export default function Page() {
  return (
    <DocBox
      notices={[
        "2-3人联机时，建议选择带宽不低于0.5M的联机节点，人更多时选择更大带宽节点",
      ]}
    >
      <Text>这里只有手游的联机教程，如果是端游请找服主</Text>

      <Divider my={5} />

      <Text textAlign="center"></Text>

      <Text>喵服方舟手游交流Q群 1106534252</Text>
      <Text fontSize="sm" color="gray.300" mt={1}>
        联机有问题或找搭子请加群
      </Text>

      <Divider my={5} />

      <Heading size="md">联机步骤</Heading>

      <Text fontSize="sm" my={1} color="gray.300">
        手游需要使用
        <Link
          href="https://space.bilibili.com/597869160"
          color="#7dd4ff"
          target="_blank"
        >
          琳星Lin-C
        </Link>
        制作的版本，群文件里可下载
      </Text>

      <VStack align="stretch" spacing={3}>
        <Box borderLeft="4px solid" borderColor="#7dd4ff" pl={4}>
          <Badge colorScheme="blue" mb={1}>
            第 1 步 · 主机
          </Badge>
          <Text>一名玩家作为主机，根据下图创建多人游戏</Text>
          <Text fontSize="sm" color="gray.300" my={1}>
            游戏必须保持在前台，不能锁屏或切到后台
          </Text>
          <Image w="600px" src="/images/ark/ark_1.webp" alt="ark_1" />
        </Box>
        <Box borderLeft="4px solid" borderColor="#7dd4ff" pl={4}>
          <Badge colorScheme="blue" mb={1}>
            第 2 步 · 客机
          </Badge>
          <Text>
            其他玩家作为客机，打开游戏控制台，输入命令加入游戏，格式如下
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
              admincheat open 主机喵服IP
            </Code>
            比如主机喵服IP是100.64.0.1
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
              admincheat open 100.64.0.1
            </Code>
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
          如果加入提示连接超时，客机自己开个主机房间，再退出来，然后进单机再输入一次代码就能进了
        </Text>
        <Text>
          <Icon as={MdTipsAndUpdates} mr={1} />
          如果加入游戏后闪退，检查双方游戏版本是否一致，如果是一致，主机重开游戏试试，还不行就进群问问
        </Text>
      </VStack>

      <Divider my={5} />

      <Heading size="md" mb={3}>
        修改联机游戏距离
      </Heading>

      <VStack align="stretch" spacing={1}>
        <Text>
          <Icon as={MdTipsAndUpdates} mr={1} />
          找到游戏的配置文件
          GameUserSettings.ini，找到下方的这个设置并将数值改为40.00000
          <Code
            display="block"
            whiteSpace="pre-wrap"
            p={1}
            borderRadius="md"
            bg="gray.900"
            color="cyan.200"
            fontSize="sm"
            fontFamily="mono"
          >
            ListenServerTetherDistanceMultiplier=40.00000
          </Code>
        </Text>
        <Text fontSize="sm" color="gray.300">
          只需要主机修改，40为建议值，太大也不行
        </Text>
      </VStack>

      <Divider my={5} />

      <BackButton />
    </DocBox>
  );
}
