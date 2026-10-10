import { useEffect, useState } from "react";
import {
  Box,
  Collapse,
  Flex,
  Icon,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import { MdTipsAndUpdates } from "react-icons/md";
import BackButton from "@/components/docs/BackButton";
import { Card } from "@/components/universal/ui";
import { useUserStateStore } from "@/store/user-state";

export default function Page() {
  const userWgInfo = useUserStateStore((s) => s.userWgInfo);

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
    <Box maxW="900px" mx="auto" pb={5}>
      <Card p={{ base: 4, md: 5 }}>
        <VStack align="stretch" spacing={3}>
          {(platform === "windows" || platform === "android") && (
            <Tip>
              老用户注意！以前的WG客户端要删掉，会与喵服客户端冲突！如果开了WG客户端，删掉后重启电脑，再用喵服客户端连接
            </Tip>
          )}

          {platform === "web" && (
            <>
              <Tip>
                连接的隧道名称是否为
                <strong>{userWgInfo?.tunnel_name}</strong>
                ，如果不是请导入正确隧道
              </Tip>
              <Tip>
                隧道必须是自己账号的！不能用其他人给的conf_key/二维码/隧道文件
              </Tip>
            </>
          )}

          {platform === "android" && (
            <Tip>
              小米/红米设备，必须关掉“WLAN网络优化”
              <Text
                ml={2}
                as="button"
                type="button"
                color="brand.text"
                fontWeight="600"
                textAlign="left"
                onClick={() => setShowXM(!showXM)}
              >
                {showXM ? "点击收起" : "点击查看关闭方法"}
              </Text>
              <Collapse in={showXM}>
                <Box
                  mt={2}
                  border="1px solid"
                  borderColor="border.line"
                  borderRadius="control"
                  p={3}
                  bg="bg.subtle"
                >
                  <Text fontSize="sm" color="text.muted" lineHeight="1.8">
                    系统版本不同界面可能不一样（找不到可以干脆关掉游戏加速）
                    <br />
                    找到系统的游戏加速，打开加速设置-&gt;性能增强-&gt;性能增强-&gt;把“WLAN网络优化”关闭
                  </Text>
                  <Image
                    w="100%"
                    maxW="600px"
                    mt={2}
                    src="/images/wg/xiaomi.webp"
                    alt="xiaomi"
                    borderRadius="control"
                  />
                </Box>
              </Collapse>
            </Tip>
          )}

          <Tip>
            确保玩家自己联机设备的网络足够稳定，任一方网络卡顿都会导致联机卡顿
          </Tip>

          {platform === "windows" && (
            <Tip>关掉其他游戏加速器或VPN，建议用WiFi/有线网络联机</Tip>
          )}

          <Tip>
            部分学校的校园网会拦截喵服的流量，连手机热点可进行验证，开热点的时候记得断开WiFi
          </Tip>

          <Tip>
            大陆外玩家只能用跨境线路节点，节点列表线路筛选，选跨境。国外部分地区用跨境线路节点也连不上，目前已知俄罗斯，这种情况请找服主特殊处理
          </Tip>

          <Tip>还是解决不了就找服主问问，QQ1299577815</Tip>
        </VStack>
      </Card>

      <BackButton />
    </Box>
  );
}

/** 单条排查建议 */
const Tip = ({ children }: { children: React.ReactNode }) => (
  <Flex align="flex-start" gap={2}>
    <Icon
      as={MdTipsAndUpdates}
      boxSize={4}
      color="brand.text"
      flexShrink={0}
      mt="3px"
    />
    <Text fontSize="sm" color="text.muted" lineHeight="1.8" as="div">
      {children}
    </Text>
  </Flex>
);
