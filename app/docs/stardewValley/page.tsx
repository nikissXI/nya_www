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
} from "@chakra-ui/react";
import { Button } from "@/components/universal/button";
import { useUserStateStore } from "@/store/user-state";
import { useState } from "react";
import { getAuthToken } from "@/store/authKey";
import { MdTipsAndUpdates } from "react-icons/md";
import {
  FiArrowDownLeft,
  FiArrowDownRight,
  FiArrowUpLeft,
  FiArrowUpRight,
} from "react-icons/fi";
import DocBox from "@/components/docs/DocBox";
import DocLink from "@/components/docs/DocLink";
import BackButton from "@/components/docs/BackButton";
import { apiUrl } from "@/utils/api";

export default function Page() {
  const { userInfo, setShowLoginModal } = useUserStateStore();
  const [inputIp, setInputIp] = useState("");
  const [showText, setShowText] = useState("");
  const [isChecking, setIsChecking] = useState(false);

  const createTask = async (hosterIp: string) => {
    const normalizedIp = hosterIp.trim();
    if (!normalizedIp) {
      setShowText("请先输入农场主的喵服 IP");
      return;
    }

    setIsChecking(true);
    setShowText("正在查房，请保持农场在前台并稍候……");

    try {
      const resp = await fetch(
        `${apiUrl}/stardewValleyRoomCheck?hosterIp=${encodeURIComponent(normalizedIp)}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        },
      );

      if (resp.ok) {
        const data = await resp.json();
        setShowText(data.msg || "查房完成，请根据结果继续排查");
      } else {
        setShowText("查房服务暂时不可用，请稍后再试");
      }
    } catch {
      setShowText("网络请求失败，请检查网络后重试");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <DocBox
      notices={[
        "手机或平板做主机时，要保持在游戏中，否则客机无法加入或掉线",
        "星露谷支持跨安卓、苹果、电脑联机，但游戏版本必须一致",
      ]}
    >
      <DocLink
        linkText="简略视频演示"
        linkUrl="https://www.bilibili.com/video/BV1U1eGe8Eka/"
      />

      <Heading size="md" mb={3}>
        联机步骤
      </Heading>
      <VStack align="stretch" spacing={3}>
        <Box borderLeft="4px solid" borderColor="#7dd4ff" pl={4}>
          <Badge colorScheme="blue" mb={1}>
            第 1 步 · 主机
          </Badge>
          <Text>主机进入存档并选择“主持农场”，等待农场完全加载。</Text>
          <Text fontSize="sm" color="gray.300" mt={1}>
            手机或平板做主机时，游戏必须保持在前台，不能锁屏或切到后台。
          </Text>
        </Box>
        <Box borderLeft="4px solid" borderColor="#7dd4ff" pl={4}>
          <Badge colorScheme="blue" mb={1}>
            第 2 步 · 客机
          </Badge>
          <Text>客机打开多人游戏，等待并选择主机创建的农场加入。</Text>
          <Text fontSize="sm" color="gray.300" mt={1}>
            如果搜索不到农场，先确认主机仍在游戏内，再使用下方的查房功能。
          </Text>
        </Box>
        <Box borderLeft="4px solid" borderColor="#7dd4ff" pl={4}>
          <Badge colorScheme="blue" mb={1}>
            第 3 步 · 版本与客户端
          </Badge>
          <Text>
            所有玩家使用相同游戏版本；出现闪退、黑屏或加入失败时，先暂时关闭
            SMAPI 和所有模组，改用原版客户端测试。
          </Text>
        </Box>
      </VStack>

      <Text mt={4} fontSize="sm" color="gray.300">
        喵服关联QQ群：817658554。游戏中偶尔无法移动时，队友赠送任意物品通常可以解除；也可以在设置中改用摇杆加按钮操作。
      </Text>

      <Divider my={5} />

      <Heading size="md" mb={3}>
        加入失败？按这个顺序检查
      </Heading>

      <VStack align="stretch" spacing={2} fontSize="sm">
        <Text>
          <Icon as={MdTipsAndUpdates} mr={1} />
          主机完全退出游戏后重新打开，再重新主持农场；必要时换一个人做主机或新建农场。
        </Text>
        <Text>
          <Icon as={MdTipsAndUpdates} mr={1} />
          主机检查防火墙是否放行星露谷，仍然无法加入时可暂时关闭防火墙测试。
        </Text>
        <Text>
          <Icon as={MdTipsAndUpdates} mr={1} />
          iOS设备在系统设置中找到星露谷，确认“本地网络”权限已开启。
        </Text>
        <Text>
          <Icon as={MdTipsAndUpdates} mr={1} />
          每位玩家轮流主持一次并查房：谁的农场始终搜不到，问题通常就在谁的设备或游戏设置上。
        </Text>
      </VStack>

      <Box
        mt={4}
        p={4}
        border="1px solid"
        borderColor="whiteAlpha.300"
        borderRadius="md"
      >
        <Heading size="sm" mb={2}>
          查房工具
        </Heading>
        <Text fontSize="sm" color="gray.300" mb={3}>
          输入农场主的喵服 IP，例如 100.64.0.1。查房时请让目标农场保持在前台。
        </Text>
        {userInfo ? (
          <Flex direction={{ base: "column", sm: "row" }} gap={2}>
            <Input
              flex={1}
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
              placeholder="例如：100.64.0.1"
              aria-label="农场主喵服 IP"
              bg="white"
              color="#1a202c"
              borderColor="#a0aec0"
              _placeholder={{ color: "#718096" }}
            />

            <Button
              onClick={() => createTask(inputIp)}
              isLoading={isChecking}
              loadingText="检查中"
              flexShrink={0}
            >
              查房
            </Button>
          </Flex>
        ) : (
          <Button size="sm" onClick={setShowLoginModal}>
            请登录后再操作，点击登录
          </Button>
        )}
        {showText && (
          <Text mt={3} color="#ffd648" fontSize="sm" role="status">
            {showText}
          </Text>
        )}
      </Box>

      <Divider my={5} />

      <Box>
        <Heading size="md" mb={2}>
          移动端 1.6 解锁联机模式
        </Heading>
        <Text fontSize="sm">
          如果移动端主界面没有联机入口：先点击右下角语言按钮切换为
          English，再按图片所示顺序点击主界面 Logo 上的 4
          片树叶，最后点击右下角的问号。
        </Text>
        <HStack
          spacing={3}
          mt={3}
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
      </Box>

      <Image
        mt={3}
        w="100%"
        src="/images/stardewValley/stardewValley_1.webp"
        alt="星露谷移动端解锁联机模式的树叶点击顺序示意图"
      />

      <Divider my={5} />

      <BackButton />
    </DocBox>
  );
}
