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
        "支持端游和手游联机，需游戏版本一致",
        "建议选择STS联机节点，8个人联机也够用",
      ]}
    >
      <Text fontSize="md">喵服杀戮尖塔交流Q群 698892019</Text>
      <Text fontSize="sm" color="gray.300" mt={1}>
        联机有问题或找搭子请加群
      </Text>

      <Divider my={5} />

      <Heading size="md">联机步骤</Heading>

      <Text fontSize="sm" my={1} color="gray.300">
        端游和手游一样，不过端游要加mod，下面细说
      </Text>

      <VStack align="stretch" spacing={3}>
        <Box borderLeft="4px solid" borderColor="#7dd4ff" pl={4}>
          <Badge colorScheme="blue" mb={1}>
            第 1 步 · 主机
          </Badge>
          <Text>一名玩家作为主机，进入多人模式，创建多人游戏</Text>
          <Text fontSize="sm" color="gray.300" mt={1}>
            手机或平板做主机时，游戏必须保持在前台，不能锁屏或切到后台
          </Text>
        </Box>
        <Box borderLeft="4px solid" borderColor="#7dd4ff" pl={4}>
          <Badge colorScheme="blue" mb={1}>
            第 2 步 · 客机
          </Badge>
          <Text>
            其他玩家作为客机，填写主机的喵服IP加入即可，端口用默认的33771
          </Text>
          <Text fontSize="sm" color="gray.300" mt={1}>
            如果有任一玩家是端游，就需要全部玩家都安装IP联机mod，因为端游原版是没有IP联机选项的
          </Text>
        </Box>
        <Box borderLeft="4px solid" borderColor="#7dd4ff" pl={4}>
          <Badge colorScheme="blue" mb={1}>
            IP联机mod（按需安装）
          </Badge>

          <Text fontSize="sm" color="gray.300">
            如果全部玩家都是手游就不需要装IP联机mod，手游已经内置了
          </Text>

          <Text my={1}>
            这里提供一个兼容v0.111版本的，也可以自行找其他同类mod
            <Link
              ml={1}
              color="#7dd4ff"
              href="/apks/[IP直连1.4.0][v0.111].zip"
              target="_blank"
            >
              下载IP联机mod
            </Link>
          </Text>

          <Text fontSize="sm">
            手游如果安装了IP联机mod，需要在启动器的设置里把“本地联机补丁”关掉
          </Text>
          <Image
            w="300px"
            src="/images/slayTheSpire/off_lan_mod.webp"
            alt="off_lan_mod"
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
          如果手游加入报错，并且装了IP联机mod，请检查“本地联机补丁”是否关掉，上面有提及
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
