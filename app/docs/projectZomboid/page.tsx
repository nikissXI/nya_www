import {
  Heading,
  Divider,
  Text,
  Box,
  VStack,
  Badge,
  Icon,
  Image,
  Link,
} from "@chakra-ui/react";
import DocBox from "@/components/docs/DocBox";
import BackButton from "@/components/docs/BackButton";
import { MdTipsAndUpdates } from "react-icons/md";

export default function AndroidPage0() {
  return (
    <DocBox
      notices={[
        "2~3人联机时，建议选择带宽不低于0.5M的联机节点，人更多时选择更大带宽节点",
      ]}
    >
      <Text>该游戏玩家群体太小，没有专门的交流群</Text>
      <Text fontSize="sm" color="gray.300" mt={1}>
        联机有问题请去大群找群主
      </Text>

      <Divider my={5} />

      <Heading size="md" mb={2}>
        联机步骤
      </Heading>

      <VStack align="stretch" spacing={3}>
        <Box borderLeft="4px solid" borderColor="#7ddcff" pl={4}>
          <Badge colorScheme="blue" mb={1}>
            第 1 步 · 主机
          </Badge>
          <Text>一名玩家作为主机，建立服务器，进到地图里等待</Text>
        </Box>
        <Box borderLeft="4px solid" borderColor="#7ddcff" pl={4}>
          <Badge colorScheme="blue" mb={1}>
            第 2 步 · 客机
          </Badge>
          <Text>其他玩家作为客机，根据下图指引填写信息加入游戏</Text>
          <Image src="/images/projectZomboid/hoster.webp" alt="hoster" />
        </Box>
      </VStack>

      <Divider my={5} />

      <Heading size="md" mb={3}>
        联机失败？按顺序检查
      </Heading>

      <VStack align="stretch" spacing={2}>
        <Text>
          <Icon as={MdTipsAndUpdates} mr={1} />
          如果是Windows做主机，试试关闭防火墙
          <Link
            ml={1}
            href="https://zhuanlan.zhihu.com/p/397675766"
            color="#7ddcff"
            target="_blank"
          >
            不会关点我
          </Link>
        </Text>
        <Text>
          <Icon as={MdTipsAndUpdates} mr={1} />
          如果加入后或规律性闪退、黑屏，请自行检查mod或是游戏bug
        </Text>
      </VStack>

      <Divider my={5} />

      <BackButton />
    </DocBox>
  );
}
