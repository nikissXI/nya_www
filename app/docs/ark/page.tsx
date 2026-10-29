import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import DocBox from "@/components/docs/DocBox";
import BackButton from "@/components/docs/BackButton";
import {
  DocCode,
  DocDivider,
  DocImage,
  DocMuted,
  DocStep,
  DocTip,
  DocTips,
  ExtLink,
} from "@/components/docs/DocParts";
import { INPUT_STYLE } from "@/components/universal/ui";
import { useState } from "react";
import { ApiError } from "@/utils/api";
import { api } from "@/utils/endpoints";

export default function Page() {
  const [inputIp, setInputIp] = useState("");
  const [showText, setShowText] = useState("");
  const [isChecking, setIsChecking] = useState(false);

  const createTask = async (hosterIp: string) => {
    const normalizedIp = hosterIp.trim();
    if (!normalizedIp) {
      setShowText("请先输入主机的喵服IP");
      return;
    }

    setIsChecking(true);
    setShowText("正在查房，主机请保持在游戏里……");

    try {
      const { msg } = await api.arkRoomCheck(normalizedIp);
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
        "2-3人联机时，建议选择带宽不低于0.5M的联机节点，人更多时选择更大带宽节点",
      ]}
    >
      <Text textAlign="center"></Text>

      <Text>喵服方舟手游交流Q群 1106534252</Text>
      <DocMuted mt={1}>联机有问题或找搭子请加群</DocMuted>

      <DocDivider />

      <Text>这里只有手游的联机教程，如果是端游请找服主</Text>
      <Text my={1}>
        手游需要使用
        <ExtLink href="https://space.bilibili.com/597869160">
          琳星Lin-C
        </ExtLink>{" "}
        制作的版本，群文件里可下载
      </Text>

      <DocDivider />

      <Heading size="md" mb={2}>
        联机步骤
      </Heading>

      <VStack align="stretch" spacing={3}>
        <DocStep step={1} role="主机">
          <Text>一名玩家作为主机，根据下图创建多人游戏</Text>
          <DocMuted my={1}>游戏必须保持在前台，不能锁屏或切到后台</DocMuted>
          <DocMuted my={1}>
            oppo和一加手机有时候没有非专用主机，大退游戏重试
          </DocMuted>
          <DocImage w="600px" src="/images/ark/ark_1.webp" alt="ark_1" />
        </DocStep>

        <DocStep step={2} role="客机">
          <DocMuted>
            控制台打开方法：进单机地图后，左上角打开菜单，点控制台命令
          </DocMuted>
          <Text>
            其他玩家作为客机，打开游戏控制台，输入命令加入游戏，格式如下
            <DocCode>admincheat open 主机喵服IP</DocCode>
            比如主机喵服IP是100.64.0.1
            <DocCode>admincheat open 100.64.0.1</DocCode>
            注意命令里的open左右都要加空格
          </Text>
        </DocStep>
      </VStack>

      <DocDivider />

      <Heading size="md" mb={3}>
        联机失败？按顺序检查
      </Heading>

      <DocTips>
        <DocTip>
          要登陆Epic账号，就是点开始游戏如果提示“SIGN IN”，要点击完成登陆才能联机
        </DocTip>
        <DocTip>
          如果加入提示连接超时，客机自己开个主机房间，再退出来，然后进单机再输入一次代码就能进了
        </DocTip>
        <DocTip>
          如果加入游戏后闪退，检查双方游戏版本是否一致，如果是一致，主机重开游戏试试，还不行就进群问问
        </DocTip>
        <DocTip>
          客机使用下方的查房工具，填写主机的喵服IP，如果查找房间失败，则代表主机问题，反之客机问题
        </DocTip>
      </DocTips>

      {/* 查房工具 */}
      <Box
        mt={3}
        p={3}
        bg="bg.active"
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
            placeholder="填主机的喵服ip，如 100.64.0.1"
            aria-label="主机喵服IP"
          />
        </Flex>

        {showText && (
          <Text mt={2} color="warning.text" fontSize="sm" role="status">
            {showText}
          </Text>
        )}
      </Box>

      <DocDivider />

      <Heading size="md" mb={3}>
        修改联机游戏距离
      </Heading>

      <VStack align="stretch" spacing={1}>
        <Text>
          在游戏的配置文件GameUserSettings.ini，找到下方的这个设置并将数值改为40.00000
        </Text>
        <DocCode>ListenServerTetherDistanceMultiplier=40.00000</DocCode>
        <DocMuted>只需要主机修改，40为建议值，太大也不行</DocMuted>
      </VStack>

      <DocDivider />

      <BackButton />
    </DocBox>
  );
}
