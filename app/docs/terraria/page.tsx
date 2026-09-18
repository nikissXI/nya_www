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
import { MdTipsAndUpdates } from "react-icons/md";
import DocBox from "@/components/docs/DocBox";
import BackButton from "@/components/docs/BackButton";

export default function Page() {
  return (
    <DocBox
      notices={[
        "国际版支持安卓、苹果、电脑三端跨平台联机",
        "TapTap版仅支持安卓与苹果联机，且不支持与国际版联机",
        "2-3人联机时，建议选择带宽不低于0.6M的联机节点，人更多时选择更大带宽节点",
      ]}
    >
      <Text>喵服泰拉瑞亚交流Q群 976129564</Text>
      <Text fontSize="sm" color="gray.300" mt={1}>
        联机有问题或找搭子请加群
      </Text>

      <Divider my={5} />

      <Heading size="md">联机步骤</Heading>

      <Text fontSize="sm" my={1} color="gray.300">
        端游和手游一样，下图用的是安卓国际版
      </Text>

      <VStack align="stretch" spacing={3}>
        <Box borderLeft="4px solid" borderColor="#7dd4ff" pl={4}>
          <Badge colorScheme="blue" mb={1}>
            第 1 步 · 主机
          </Badge>
          <Text>
            一名玩家作为主机，进到多人模式，创建一个多人世界并进去世界里等待
          </Text>
          <Text fontSize="sm" color="gray.300" mt={1}>
            手机或平板做主机时，游戏必须保持在前台，不能锁屏或切到后台
          </Text>
          <Image w="400px" src="/images/terraria/hoster.webp" alt="hoster" />
        </Box>
        <Box borderLeft="4px solid" borderColor="#7dd4ff" pl={4}>
          <Badge colorScheme="blue" mb={1}>
            第 2 步 · 客机
          </Badge>
          <Text>其他玩家作为客机，进到多人模式，看下图操作吧</Text>
          <Image
            mt={1}
            w="400px"
            src="/images/terraria/joiner1.webp"
            alt="joiner1"
          />
          <Image
            mt={1}
            w="400px"
            src="/images/terraria/joiner2.webp"
            alt="joiner2"
          />
          <Image
            mt={1}
            w="400px"
            src="/images/terraria/joiner3.webp"
            alt="joiner3"
          />
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
            color="#7dd4ff"
            target="_blank"
          >
            不会关点我
          </Link>
        </Text>
        <Text>
          <Icon as={MdTipsAndUpdates} mr={1} />
          装tMod不影响联机，如果装了后不能联机，关闭防火墙及检查模组
        </Text>
        <Text>
          <Icon as={MdTipsAndUpdates} mr={1} />
          提示版本不一样就自己检查版本，最上面的注意事项写了TapTap版不支持与国际版联机
        </Text>
      </VStack>

      <Divider my={5} />

      <BackButton />
    </DocBox>
  );
}
