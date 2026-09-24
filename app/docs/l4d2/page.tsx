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
  Code,
} from "@chakra-ui/react";
import { MdTipsAndUpdates } from "react-icons/md";
import DocBox from "@/components/docs/DocBox";
import BackButton from "@/components/docs/BackButton";

export default function Page() {
  return (
    <DocBox
      notices={[
        "正版和盗版都支持，但盗版卡Steam验证自己去解决",
        "2~3人联机时，建议选择带宽不低于0.8M的联机节点，人更多时选择更大带宽节点",
      ]}
    >
      <Text>喵服求生之路2交流Q群 138012638</Text>
      <Text fontSize="sm" color="gray.300" mt={1}>
        联机有问题或找搭子请加群
      </Text>

      <Divider my={5} />

      <Heading size="md">启用游戏控制台</Heading>

      <Text my={1}>
        进入游戏主界面，点击 <strong>选项 → 键盘/鼠标</strong>
        ，将“允许使用开发者控制台”设置为启用
      </Text>

      <Text>
        在游戏中按 <strong>~</strong> 键（通常在键盘左上角）打开控制台
      </Text>

      <Divider my={5} />

      <Heading size="md">联机步骤</Heading>

      <Text fontSize="sm" my={1} color="gray.300">
        教程使用的是Steam正版
      </Text>

      <VStack align="stretch" spacing={3}>
        <Box borderLeft="4px solid" borderColor="#7ddcff" pl={4}>
          <Badge colorScheme="blue" mb={1}>
            第 1 步 · 主机
          </Badge>
          <Text>
            一名玩家作为主机，进游戏点
            <strong>完成战役 → 与好友一起玩游戏 → 创建新战役大厅</strong>
          </Text>
          <Image w="500px" src="/images/l4d2/hoster1.webp" alt="hoster1" />

          <Text mt={3}>
            服务器类型选 <strong>本地服务器</strong>
            ，然后直接开始游戏，进到游戏地图里等待
          </Text>
          <Image w="500px" src="/images/l4d2/hoster3.webp" alt="hoster3" />

          <Text mt={3}>
            如果玩第三方地图，打开控制台用命令创建游戏
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
              map 地图代码 游戏模式
            </Code>
            比如 死亡中心-旅馆 合作模式
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
              map c1m1_hotel coop
            </Code>
          </Text>
          <Text fontSize="sm" color="gray.300" mt={1}>
            控制台更多命令用法自行网上搜索或问AI
          </Text>
        </Box>
        <Box borderLeft="4px solid" borderColor="#7ddcff" pl={4}>
          <Badge colorScheme="blue" mb={1}>
            第 2 步 · 客机
          </Badge>
          <Text>
            其他玩家作为客机，打开控制台用命令加入游戏
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
              connect 主机喵服IP
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
              connect 100.64.0.1
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
          加入游戏失败如果是下图错误，让主机关闭防火墙再试
          <Link
            ml={1}
            href="https://zhuanlan.zhihu.com/p/397675766"
            color="#7ddcff"
            target="_blank"
          >
            不会关点我
          </Link>
          <Image h="150px" src="/images/l4d2/joiner.webp" alt="joiner" />
        </Text>
        <Text>
          <Icon as={MdTipsAndUpdates} mr={1} />
          其他加入报错请加群询问（不一定能解决）或自行网上查找解决方法
        </Text>
        <Text>
          <Icon as={MdTipsAndUpdates} mr={1} />
          建议到创意工坊把这个mod打上，能一定程度上避免兼容性问题导致无法加入，或自己找其他类似的mod也可以
          <Image w="500px" src="/images/l4d2/mod.webp" alt="mod" />
        </Text>
      </VStack>

      <Divider my={5} />
      <Heading size="md" mb={3}>
        用喵服后联机还是卡顿？
      </Heading>

      <VStack align="stretch" spacing={2}>
        <Text>
          <Icon as={MdTipsAndUpdates} mr={1} />
          比如主机到节点延迟30ms，客机到节点延迟50ms，那游戏的实际延迟将至少80ms
        </Text>
        <Text>
          <Icon as={MdTipsAndUpdates} mr={1} />
          如果丧尸一多，主机客机就一起卡，这种情况多半是主机电脑硬件太新，这老游戏对新硬件兼容性不好，可以尝试用服务端开服
        </Text>
      </VStack>

      <Divider my={5} />

      <BackButton />
    </DocBox>
  );
}
