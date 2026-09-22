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
import { Button } from "@/components/universal/button";
import { useState } from "react";
import { MdTipsAndUpdates } from "react-icons/md";
import {
  FiArrowDownLeft,
  FiArrowDownRight,
  FiArrowUpLeft,
  FiArrowUpRight,
} from "react-icons/fi";
import DocBox from "@/components/docs/DocBox";
import BackButton from "@/components/docs/BackButton";
import { ApiError, requestEnvelope } from "@/utils/api";

export default function Page() {
  const [inputIp, setInputIp] = useState("");
  const [showText, setShowText] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [showUnlockGuide, setShowUnlockGuide] = useState(false);

  const createTask = async (hosterIp: string) => {
    const normalizedIp = hosterIp.trim();
    if (!normalizedIp) {
      setShowText("请先输入农场主的喵服 IP");
      return;
    }

    setIsChecking(true);
    setShowText("正在查房，请保持农场在前台并稍候……");

    try {
      const { msg } = await requestEnvelope<string>("/stardewValleyRoomCheck", {
        params: { hosterIp: normalizedIp },
      });
      setShowText(msg ?? "响应结果异常，请联系服主");
    } catch (err) {
      setShowText(
        err instanceof ApiError && err.status !== null
          ? err.message
          : "网络请求失败，请检查网络后重试",
      );
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <DocBox
      notices={[
        "支持跨安卓、苹果、电脑联机，需游戏版本一致",
        "2-3人联机时，建议选择带宽不低于0.5M的联机节点，人更多时选择更大带宽节点",
      ]}
    >
      <Box>
        <Heading size="md">移动端1.6.X版本解锁联机模式</Heading>

        <Text my={1} fontSize="sm" color="gray.300">
          如果游戏主界面已有合作按钮请忽略
        </Text>

        <Button
          fontSize="md"
          size="xs"
          flexShrink={0}
          onClick={() => setShowUnlockGuide((shown) => !shown)}
        >
          {showUnlockGuide ? "点击收起" : "点击查看"}
        </Button>

        {showUnlockGuide && (
          <>
            <Text mt={1}>①点击右下角语言按钮切换为English</Text>
            <Text mt={1}>②再按顺序点击下方箭头所指方向的4片树叶</Text>
            <HStack
              spacing={3}
              mb={1}
              color="#7dd4ff"
              fontSize="xl"
              aria-label="树叶点击顺序"
            >
              <FiArrowUpRight />
              <FiArrowUpRight />
              <FiArrowDownLeft />
              <FiArrowDownLeft />
              <FiArrowUpLeft />
              <FiArrowDownRight />
              <FiArrowUpLeft />
              <FiArrowDownRight />
            </HStack>
            <Image
              w="300px"
              src="/images/stardewValley/解锁联机模式.webp"
              alt="星露谷移动端解锁联机模式的树叶点击顺序示意图"
            />
            <Text mt={2}>③点击右下角的问号</Text>
          </>
        )}
      </Box>

      <Divider my={5} />

      <Text>喵服星露谷物语交流Q群 817658554</Text>
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
            一名玩家作为主机，点击主界面的合作，主持一个农场，进入到该多人农场里等待
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
            其他玩家作为客机，点击主界面的合作，填写主机的喵服ip完成加入
          </Text>
          <Text fontSize="sm" color="gray.300" mt={1}>
            如果突然无法移动（这是游戏BUG），队友赠送任意物品通常可以解除；也可以在设置中改用摇杆加按钮操作
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
          如果是iOS设备，在系统设置中找到星露谷，确认“本地网络”权限已开启
        </Text>
        <Text>
          <Icon as={MdTipsAndUpdates} mr={1} />
          加入闪退、黑屏，检查双方是否安装了模组，如果安装了换原版再测试看看
        </Text>
        <Text>
          <Icon as={MdTipsAndUpdates} mr={1} />
          主机完全退出游戏，再重新运行游戏主持农场；还不行就试试换一个人做主机或新建农场
        </Text>
        <Text>
          <Icon as={MdTipsAndUpdates} mr={1} />
          使用下方的查房工具，每位玩家轮流主持一次农场并让另一位玩家查房，谁的农场搜不到，就是谁的问题
        </Text>
      </VStack>

      <Box
        mt={2}
        p={2}
        bg="rgba(52, 139, 246, 0.18)"
        borderRadius="md"
        maxW="360px"
      >
        <Heading size="sm" mb={2} textAlign="center">
          查房工具
        </Heading>

        <Flex gap={2}>
          <Button
            size="sm"
            onClick={() => createTask(inputIp)}
            isLoading={isChecking}
            loadingText="检查中"
            flexShrink={0}
          >
            查找
          </Button>

          <Input
            size="sm"
            type="text"
            value={inputIp}
            onChange={(e) => {
              setInputIp(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isChecking) {
                createTask(inputIp);
              }
            }}
            placeholder="填农场主喵服ip，如 100.64.0.1"
            aria-label="农场主喵服 IP"
            bg="white"
            color="#1a202c"
            borderRadius="md"
            _placeholder={{ color: "#718096" }}
          />
        </Flex>

        {showText && (
          <Text mt={1} color="#ffd648" fontSize="sm" role="status">
            {showText}
          </Text>
        )}
      </Box>

      <Divider my={5} />

      <Heading size="md">单机农场转联机农场</Heading>

      <Text fontSize="sm" my={1} color="gray.300">
        端游和手游一样
      </Text>

      <VStack align="stretch" spacing={2}>
        <Text>
          ①
          进入要转换的担任农场里，前往地图右上角的【木匠的商店】，向游戏NPC【罗宾】对话
          → 【建造农场建筑】 →
          【联机小屋】，根据你需要联机的人数来建造联机小屋即可
        </Text>
        <Text>
          ②
          联机小屋建造完毕后，返回农场睡觉度过当天，然后在第二天早上即可退出农场，即可在合作的【主持】的页面中，找到你的单机存档进行联机
        </Text>
      </VStack>

      <Divider my={5} />

      <BackButton />
    </DocBox>
  );
}
