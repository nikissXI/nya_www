import { useState } from "react";
import {
  Box,
  Divider,
  Flex,
  Heading,
  HStack,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  FiArrowDownLeft,
  FiArrowDownRight,
  FiArrowUpLeft,
  FiArrowUpRight,
} from "react-icons/fi";
import { Button } from "@/components/universal/button";
import DocBox from "@/components/docs/DocBox";
import BackButton from "@/components/docs/BackButton";
import {
  DocImage,
  DocMuted,
  DocStep,
  DocTip,
  DocTips,
  ExtLink,
} from "@/components/docs/DocParts";
import { INPUT_STYLE } from "@/components/universal/ui";
import { ApiError } from "@/utils/api";
import { api } from "@/utils/endpoints";

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
      const { msg } = await api.stardewValleyRoomCheck(normalizedIp);
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

        <DocMuted my={1}>如果游戏主界面已有合作按钮请忽略</DocMuted>

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
              color="brand.text"
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
            <DocImage
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
      <DocMuted mt={1}>联机有问题或找搭子请加群</DocMuted>

      <Divider my={5} />

      <Heading size="md">联机步骤</Heading>

      <DocMuted my={1}>端游和手游一样</DocMuted>

      <VStack align="stretch" spacing={3}>
        <DocStep step={1} role="主机">
          <Text>
            一名玩家作为主机，点击主界面的合作，主持一个农场，进入到该多人农场里等待
          </Text>
          <DocMuted mt={1}>
            手机或平板做主机时，游戏必须保持在前台，不能锁屏或切到后台
          </DocMuted>
        </DocStep>

        <DocStep step={2} role="客机">
          <Text>其他玩家作为客机，点击主界面的合作，填写主机的喵服ip完成加入</Text>
          <DocMuted mt={1}>
            如果突然无法移动（这是游戏BUG），队友赠送任意物品通常可以解除；也可以在设置中改用摇杆加按钮操作
          </DocMuted>
        </DocStep>
      </VStack>

      <Divider my={5} />

      <Heading size="md" mb={3}>
        联机失败？按顺序检查
      </Heading>

      <DocTips>
        <DocTip>
          如果是Windows做主机，试试关闭防火墙
          <ExtLink href="https://zhuanlan.zhihu.com/p/397675766">
            不会关点我
          </ExtLink>
        </DocTip>
        <DocTip>
          如果是iOS设备，在系统设置中找到星露谷，确认“本地网络”权限已开启
        </DocTip>
        <DocTip>
          加入闪退、黑屏，检查双方是否安装了模组，如果安装了换原版再测试看看
        </DocTip>
        <DocTip>
          主机完全退出游戏，再重新运行游戏主持农场；还不行就试试换一个人做主机或新建农场
        </DocTip>
        <DocTip>
          使用下方的查房工具，每位玩家轮流主持一次农场并让另一位玩家查房，谁的农场搜不到，就是谁的问题
        </DocTip>
      </DocTips>

      {/* 查房工具 */}
      <Box
        mt={3}
        p={3}
        bg="bg.subtle"
        border="1px solid"
        borderColor="border.line"
        borderRadius="control"
        maxW="380px"
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
            {...INPUT_STYLE}
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
          />
        </Flex>

        {showText && (
          <Text mt={2} color="warning.text" fontSize="sm" role="status">
            {showText}
          </Text>
        )}
      </Box>

      <Divider my={5} />

      <Heading size="md">单机农场转联机农场</Heading>

      <DocMuted my={1}>端游和手游一样</DocMuted>

      <VStack align="stretch" spacing={2}>
        <Text lineHeight="1.9">
          ①
          进入要转换的担任农场里，前往地图右上角的【木匠的商店】，向游戏NPC【罗宾】对话
          → 【建造农场建筑】 →
          【联机小屋】，根据你需要联机的人数来建造联机小屋即可
        </Text>
        <Text lineHeight="1.9">
          ②
          联机小屋建造完毕后，返回农场睡觉度过当天，然后在第二天早上即可退出农场，即可在合作的【主持】的页面中，找到你的单机存档进行联机
        </Text>
      </VStack>

      <Divider my={5} />

      <BackButton />
    </DocBox>
  );
}
