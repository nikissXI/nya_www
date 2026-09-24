import {
  Text,
  Heading,
  Box,
  VStack,
  Image,
  Icon,
  Divider,
  Collapse,
} from "@chakra-ui/react";
import BackButton from "@/components/docs/BackButton";
import { MdTipsAndUpdates } from "react-icons/md";
import { useUserStateStore } from "@/store/user-state";
import { useEffect, useState } from "react";

export default function Page() {
  const { userWgInfo } = useUserStateStore();
  const [platform, setPlatform] = useState("web");
  const [showXM, setShowXM] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const platform = urlParams.get("platform");

    if (platform) {
      setPlatform(platform);
    }
  }, []);

  return (
    <Box maxW="900px" mx="auto" px={{ base: 4, md: 8 }} pb={5}>
      <Heading size="lg" textAlign="center">
        联机不稳定或连接失败排查
      </Heading>

      <Text my={3} fontSize="sm" color="gray.300">
        注意：这里的连接失败指WG离线，不是游戏的连接
      </Text>

      <VStack align="stretch" spacing={2}>
        <Text display={userWgInfo ? "block" : "none"}>
          <Icon as={MdTipsAndUpdates} mr={1} />
          连接的隧道名称是否为<strong>{userWgInfo?.tunnel_name}</strong>
          ，如果不是请导入正确隧道
        </Text>

        <Text display={userWgInfo ? "block" : "none"}>
          <Icon as={MdTipsAndUpdates} mr={1} />
          隧道必须是自己账号的！不能用其他人给的conf_key/二维码/隧道文件
        </Text>

        <Text display={platform === "android" ? "block" : "none"}>
          <Icon as={MdTipsAndUpdates} mr={1} />
          小米/红米设备，必须关掉“WLAN网络优化”
          <Text
            ml={2}
            as="span"
            color="#7ddcff"
            size="sm"
            onClick={() => setShowXM(!showXM)}
          >
            {showXM ? "点击收起" : "点击查看关闭方法"}
          </Text>
          <Collapse in={showXM}>
            <Text borderWidth={2} borderRadius="md" borderColor="gray" p={2}>
              系统版本不同界面可能不一样（找不到可以干脆关掉游戏加速）
              <br />
              找到系统的游戏加速，打开加速设置-&gt;性能增强-&gt;性能增强-&gt;把“WLAN网络优化”关闭
              <Image
                w="600px"
                src="/images/wg/xiaomi.webp"
                alt="xiaomi"
                borderRadius="md"
              />
            </Text>
          </Collapse>
        </Text>

        <Text>
          <Icon as={MdTipsAndUpdates} mr={1} />
          关掉其他游戏加速器或VPN，确保玩家自己联机设备的网络足够稳定，建议使用WiFi进行联机
        </Text>

        <Text>
          <Icon as={MdTipsAndUpdates} mr={1} />
          部分学校的校园网会拦截喵服的流量，试试流量上网可进行验证
        </Text>

        <Text>
          <Icon as={MdTipsAndUpdates} mr={1} />
          大陆外玩家只能用跨境线路节点，节点列表线路筛选，选跨境。国外部分地区用跨境线路节点也连不上，目前已知俄罗斯，这种情况请找服主特殊处理
        </Text>
      </VStack>

      <Divider my={5} />

      <BackButton />
    </Box>
  );
}
