import { Button } from "@/components/universal/button";
import {
  Box,
  Heading,
  Text,
  Icon,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Flex,
  TextProps,
  Collapse,
  Image,
  Link,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useUserStateStore } from "@/store/user-state";
import { useNavigate } from "react-router-dom";
import { openToast } from "@/components/universal/toast";
import { QRCodeSVG } from "qrcode.react";
import { MdTipsAndUpdates } from "react-icons/md";
import { TbReload } from "react-icons/tb";
import { keyframes } from "@emotion/react";
import { getStatusColor } from "@/utils/strings";
import { NoticeText } from "@/components/universal/Notice";

const HighLight: React.FC<TextProps> = ({ children, ...props }) => {
  return (
    <Text as="span" color="#ffca3d" fontWeight="bold" {...props}>
      {children}
    </Text>
  );
};

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const DocumentPage = () => {
  const {
    confKey,
    getConfKey,
    userInfo,
    userWgInfo,
    setNodeListModal,
    getRoomData,
    isOnline,
    rotate,
    disableFlush,
    openLoginModal,
  } = useUserStateStore();

  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo && userWgInfo && !confKey) {
      getConfKey();
    }
  }, [userInfo, userWgInfo, confKey, getConfKey]);

  const handleCopyLink = async (confKey: string) => {
    try {
      if (navigator.clipboard && navigator.permissions) {
        await navigator.clipboard.writeText(confKey);
        openToast({ content: "key已复制到剪切板", status: "warning" });
      } else {
        throw new Error("不支持自动复制");
      }
    } catch (err) {}
  };

  const [showAndroidDLWarning, setAndroidDLWarning] = useState(false);
  const [showXM, setShowXM] = useState(false);
  const [showMSI, setShowMSI] = useState(false);

  const GenConfFile = (conf_text: string) => {
    try {
      // 创建Blob
      const blob = new Blob([conf_text], { type: "text/plain" });
      // 创建下载链接
      const url = window.URL.createObjectURL(blob);

      // 创建临时a标签并触发点击
      const a = document.createElement("a");
      a.href = url;
      a.download = `${userWgInfo?.tunnel_name ?? "tunnel"}.conf`;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();

      // 清理
      a.remove();
      window.URL.revokeObjectURL(url);

      openToast({
        content: "下载完成，请到下载任务列表查看",
        status: "success",
      });
    } catch (error) {
      openToast({
        content: "下载失败",
        status: "error",
      });
      console.error(error);
    }
  };
  //////////////////////
  //////////////////////

  const SelectNode = () => {
    return (
      <Box mb={1}>
        <Text>
          ① 当前选择的是&ensp;
          <Text as="span" color="#ffca3d" fontWeight="bold">
            {userWgInfo?.node_alias}
          </Text>
          &ensp;节点
        </Text>

        <Button ml={4} onClick={setNodeListModal} size="sm">
          点击切换节点
        </Button>

        <Text>
          <Icon as={MdTipsAndUpdates} mr={2} />
          <HighLight fontSize="sm">
            如果切换了新节点，要来这导入新节点的隧道，每个节点有对应的隧道
          </HighLight>
        </Text>

        <Text>
          <Icon as={MdTipsAndUpdates} mr={2} />
          <HighLight fontSize="sm">
            不要导入他人分享的隧道，一人一隧道不能共用
          </HighLight>
        </Text>
      </Box>
    );
  };

  const DownloadButton = (isIOS: boolean = false) => {
    return (
      <Button
        ml={3}
        size="sm"
        onClick={() => {
          if (!isIOS) {
            if (userWgInfo) GenConfFile(userWgInfo.conf_text);
            return;
          }

          // iOS 上只有 Safari 能正常下载并分享给 WG；
          // Chrome/Firefox/Edge 等内核的 UA 里同样带有 Safari 标识，需要排除掉
          const ua = navigator.userAgent;
          const isSafari =
            ua.includes("Safari") &&
            !/CriOS|FxiOS|EdgiOS|OPiOS|DuckDuckGo/.test(ua);

          if (isSafari) {
            if (userWgInfo) GenConfFile(userWgInfo.conf_text);
          } else {
            openToast({
              content: "请在Safari中打开网站下载",
              status: "warning",
            });
          }
        }}
        isDisabled={!userInfo}
      >
        点击下载{userWgInfo?.node_alias}隧道文件
      </Button>
    );
  };

  return (
    <Box px={{ base: 4, md: 8 }} pb={5} maxW="900px" mx="auto">
      <Alert
        status="info"
        variant="subtle"
        borderRadius="md"
        mb={5}
        bg="#dbeafe"
        color="#17324d"
      >
        <Box>
          <Flex color="#17324d">
            <AlertIcon />
            <AlertTitle fontSize="md">开始前请注意</AlertTitle>
          </Flex>

          <AlertDescription fontSize="sm">
            <VStack align="stretch" spacing={1} mt={1}>
              <Text>
                <Icon as={MdTipsAndUpdates} mr={1} />
                联机的每个玩家都要注册喵服并安装WG
              </Text>
              <Text>
                <Icon as={MdTipsAndUpdates} mr={1} />
                WG客户端要安装在运行游戏的设备上
              </Text>
              <Text>
                <Icon as={MdTipsAndUpdates} mr={1} />
                禁止Minecraft联机（独享节点除外）
              </Text>
              <Text>
                <Icon as={MdTipsAndUpdates} mr={1} />
                不兼容华为的鸿蒙6系统
              </Text>
            </VStack>
          </AlertDescription>
        </Box>
      </Alert>

      <Box mt={5} display={userWgInfo === undefined ? "block" : "none"}>
        <VStack spacing={3} align="center">
          <Heading size="md">请登录后再访问该页面</Heading>
          <Button
            variant="outline"
            rounded={10}
            onClick={openLoginModal}
            border={0}
          >
            点击登录
          </Button>
          <NoticeText />
        </VStack>
      </Box>

      <Box mt={5} display={userWgInfo === undefined ? "none" : "block"}>
        <Tabs variant="line">
          <Heading size="md">点击选择联机的设备类型</Heading>

          <TabList
            mt={1}
            flexWrap="wrap"
            gap={{ base: 1.5, md: 2 }} // 移动端间距小一点
            p={1}
          >
            {["安卓", "苹果", "Windows", "Mac", "SteamDeck", "Linux"].map(
              (label) => (
                <Tab
                  key={label}
                  py={1.5}
                  px={{ base: 3, md: 5 }}
                  fontWeight="bold"
                  fontSize={{ base: "sm", md: "md" }} // 响应式字体
                  borderRadius="lg"
                  _selected={{
                    color: "white",
                    bg: "blue.600",
                    boxShadow: "md", // 阴影增强选中效果
                  }}
                  transition="all 0.2s"
                >
                  {label}
                </Tab>
              ),
            )}
          </TabList>

          <TabPanels>
            {/* 安卓 */}
            <TabPanel px={0} pb={1} pt={2}>
              <SelectNode />

              <Text mt={5}>
                ② 下载并安装WG客户端
                <Text
                  as="span"
                  color="#7dd4ff"
                  onClick={() => {
                    setAndroidDLWarning(!showAndroidDLWarning);
                  }}
                >
                  &ensp;无法下载点我
                </Text>
                <br />
                <HighLight fontSize="sm">
                  &emsp;必须使用这里下载的WG客户端
                </HighLight>
              </Text>

              <Button
                ml={4}
                size="sm"
                onClick={() => {
                  window.open("/apks/wireguard.apk", "_blank");
                }}
              >
                点击下载安装包
              </Button>
              <Collapse in={showAndroidDLWarning}>
                <Text fontSize="sm">
                  &emsp;到浏览器打开网站再下载，无法下载的都是因为在QQ、微信这些非浏览器应用中下载。
                </Text>
              </Collapse>

              <Box mt={5}>
                ③ 点击或长按黄字复制
                <Text
                  ml={2}
                  as="span"
                  color="#7dd4ff"
                  onClick={() => {
                    getConfKey(true);
                  }}
                >
                  key失效点我
                </Text>
                <Text
                  ml={1}
                  fontSize="sm"
                  color="#ffd648"
                  onClick={() => {
                    if (confKey) handleCopyLink(confKey);
                  }}
                >
                  {confKey}
                </Text>
              </Box>
              <Text>
                &emsp;然后运行WG点右下角加号，选“通过conf_key导入”，粘贴黄字完成隧道导入
                <br />
                &emsp;导入的隧道名称应是 “{userWgInfo?.tunnel_name}”
              </Text>

              <Flex mt={5}>
                ④ 打开隧道开关 =&gt;
                <Image
                  mx={1}
                  maxH="1.5rem"
                  src="/images/wg/android_switch.webp"
                  alt="android_switch"
                />
              </Flex>
              <Flex alignItems="center" mt={1} fontSize="sm">
                &emsp;<HighLight>注意！小米/红米设备要改个设置</HighLight>
                <Text
                  ml={2}
                  as="span"
                  color="#7dd4ff"
                  size="sm"
                  onClick={() => setShowXM(!showXM)}
                >
                  {showXM ? "点击收起" : "点击查看"}
                </Text>
              </Flex>
              <Collapse in={showXM}>
                <Text fontSize="sm">
                  游戏加速的“网络优化”会导致无法联机，系统版本不同可能不一样，脑子灵活点
                  <br />
                  关闭方法：找到系统的游戏加速，打开加速设置-&gt;性能增强-&gt;性能增强-&gt;把“WLAN网络优化”关闭
                </Text>
                <Image
                  src="/images/wg/xiaomi.webp"
                  alt="xiaomi"
                  borderRadius="md"
                />
              </Collapse>
            </TabPanel>

            {/* iOS */}
            <TabPanel px={0} pb={1} pt={2}>
              <SelectNode />

              <Box mt={5}>
                ② 安装WG客户端，
                <HighLight>AppStore要登陆海外账号才能搜到</HighLight>
                ，如果没有海外账号，给如下几个建议
                <br />
                &emsp;1.B站搜“美区id注册”，自己看教程注册，以后干别的也用得上
                <br /> &emsp;2.tb或pdd搜“苹果游戏”租个号，选类似“国际服手游大全”
                <br /> &emsp;3.网上搜“苹果账号分享”，这是随机搜的一个，不包能用
                https://nodewu.com/iosid/
                <br /> &emsp;4.赞助喵服不低于50元可以找服主借（最好别找）
                <Image
                  src="/images/wg/app_store.webp"
                  alt="app_store"
                  borderRadius="md"
                  w="300px"
                />
              </Box>

              <Tabs variant="line" colorScheme="orange">
                <Text mt={5} fontWeight="bolder">
                  iOS导入隧道可以扫码或下载
                  <br />
                  <HighLight fontSize="sm">
                    注意不要在远程控制的状态下导入
                  </HighLight>
                </Text>

                <TabList
                  my={1}
                  display="inline-flex"
                  alignItems="center"
                  maxW="fit-content"
                >
                  <Tab
                    py={1}
                    fontWeight="bolder"
                    _selected={{ color: "white", bg: "blue.600" }}
                  >
                    扫二维码
                  </Tab>
                  <Tab
                    py={1}
                    fontWeight="bolder"
                    _selected={{ color: "white", bg: "blue.600" }}
                  >
                    下载隧道
                  </Tab>
                </TabList>

                <TabPanels>
                  <TabPanel px={0} pb={0} pt={1}>
                    <HighLight fontSize="sm">
                      不支持从相册导入二维码，所以自己想办法扫（比如借个设备拍下来再扫），扫不了就选“下载隧道”的方法
                    </HighLight>

                    <Text>
                      ③ 打开WG，点右上角+号，扫描二维码，隧道名称写&ensp;
                      {userWgInfo?.tunnel_name}
                    </Text>

                    <Box borderWidth={5} borderColor="white" w="min">
                      {userWgInfo && (
                        <QRCodeSVG size={256} value={userWgInfo.conf_text} />
                      )}
                    </Box>
                  </TabPanel>

                  <TabPanel px={0} pb={0} pt={1}>
                    <HighLight fontSize="sm">
                      建议使用Safari浏览器访问网站再下载
                      <br />
                      如果点了下载没反应就是触发BUG了，等几分钟或换个浏览器再试试
                    </HighLight>

                    <Text>③ 下载隧道文件</Text>
                    {DownloadButton(true)}

                    <Text pt={1}>
                      打开浏览器的下载任务列表，点击文件“
                      {userWgInfo?.tunnel_name}
                      .conf”，然后点左下角发送到WG
                      <br />
                      或者，到WG里导入配置也行
                    </Text>
                  </TabPanel>
                </TabPanels>
              </Tabs>

              <Flex mt={5}>
                ④ 打开隧道开关 =&gt;
                <Image
                  mx={1}
                  maxH="1.5rem"
                  src="/images/wg/iOS_switch.webp"
                  alt="iOS_switch"
                />
              </Flex>
              <Text fontSize="sm">
                如果出现DBS解析失败，并重新打开几次都不行，就换个网络再试
              </Text>
            </TabPanel>

            {/* windows */}
            <TabPanel px={0} pb={1} pt={2}>
              <SelectNode />

              <Text mt={5}>② 下载并安装WG客户端</Text>

              <Button
                size="sm"
                mx={2}
                onClick={() => {
                  window.open("/apks/wg客户端，解压后双击运行.zip", "_blank");
                }}
              >
                点击下载安装包
              </Button>

              <Box mt={5}>
                ③ 下载隧道文件，文件名为“{userWgInfo?.tunnel_name}
                .conf”
              </Box>
              {DownloadButton()}

              <Text mt={5}>④ 跟着下图操作完成隧道导入，看红字就行</Text>

              <Image
                src="/images/wg/win_msi.webp"
                alt="win_msi"
                borderRadius="md"
                w="500px"
              />

              <Flex alignItems="center" my={1}>
                <HighLight>
                  点连接如果出现“The system cannot find the file
                  specified”，检查wireguard的路径是否含有中文
                </HighLight>
              </Flex>

              <Flex alignItems="center" my={1}>
                <HighLight>点连接如果出现“隧道错误”的处理方法</HighLight>
                <Text
                  ml={2}
                  as="span"
                  color="#7dd4ff"
                  size="sm"
                  onClick={() => setShowMSI(!showMSI)}
                >
                  {showMSI ? "点击收起" : "点击查看"}
                </Text>
              </Flex>

              <Collapse in={showMSI}>
                <Text fontSize="sm">
                  <Text
                    as="span"
                    fontSize="sm"
                    color="#7dd4ff"
                    onClick={() => {
                      window.open("/apks/右键以管理员身份运行.bat", "_blank");
                    }}
                  >
                    点击下载bat修复文件
                  </Text>
                  ，然后右键“以管理员身份运行”修复。如果还是不行，就按下图指引“网络重置”试试
                </Text>
                <Image
                  src="/images/wg/network_reset.webp"
                  alt="network_reset"
                  borderRadius="md"
                  w="500px"
                  mb={10}
                />
              </Collapse>
            </TabPanel>

            {/* MAC */}
            <TabPanel px={0} pb={1} pt={2}>
              <SelectNode />

              <Box mt={5}>
                ② 安装WG客户端，
                <HighLight>AppStore要登陆海外账号才能搜到</HighLight>
                ，如果没有海外账号，给如下几个建议
                <br />
                &emsp;1.B站搜“美区id注册”，自己看教程注册，以后干别的也用得上
                <br /> &emsp;2.tb或pdd搜“苹果游戏”租个号，选类似“国际服手游大全”
                <br /> &emsp;3.网上搜“苹果账号分享”，这是随机搜的一个，不包能用
                https://nodewu.com/iosid/
                <br /> &emsp;4.赞助喵服不低于50元可以找服主借（最好别找）
                <Image
                  src="/images/wg/app_store_mac.webp"
                  alt="app_store_mac"
                  borderRadius="md"
                  w="300px"
                />
              </Box>

              <Box mt={5}>
                ③ 下载隧道文件，文件名为“{userWgInfo?.tunnel_name}.conf”
              </Box>
              {DownloadButton()}

              <Box mt={5}>
                <Text>④ 运行WG，跟着下图操作完成隧道导入，看红字就行</Text>
                <Image
                  src="/images/wg/mac.webp"
                  alt="mac"
                  borderRadius="md"
                  w="500px"
                />
              </Box>
            </TabPanel>

            {/* SteamDeck */}
            <TabPanel px={0} pb={1} pt={2}>
              <SelectNode />

              <Box mt={5}>
                ② 安装喵服Decky插件（插件由网友开发）
                <br />
                <Button
                  size="sm"
                  mx={2}
                  onClick={() => {
                    window.open("/apks/NyaFuWG.zip", "_blank");
                  }}
                >
                  点击下载插件
                </Button>
                <br />
                在Steam Deck的游戏模式打开右侧快捷菜单，进入 Decky
                插件面板，打开 `NyaFu WG`
              </Box>

              <Box mt={5}>
                ③ 下载隧道文件，文件名为“{userWgInfo?.tunnel_name}.conf”
              </Box>
              {DownloadButton()}

              <Box mt={5}>
                <Text>
                  ④ 回到插件，点击“更新隧道配置”，找到“
                  {userWgInfo?.tunnel_name}
                  .conf”，点击“导入此配置”，最后点击“连接喵服”
                </Text>
              </Box>
            </TabPanel>

            {/* Linux */}
            <TabPanel px={0} pb={1} pt={2}>
              <SelectNode />

              <Box mt={5}>
                <Text>
                  ② 看WG官方文档安装客户端，或者问deepseek
                  <br />
                  <Link
                    ml={1}
                    color="#7dd4ff"
                    href="https://www.wireguard.com/install/"
                    target="_blank"
                  >
                    点击跳转WG官方文档（需要翻墙）
                  </Link>
                </Text>

                <Box mt={5}>
                  ③ 下载隧道文件，文件名为“{userWgInfo?.tunnel_name}.conf”
                </Box>
                {DownloadButton()}

                <Box mt={5}>
                  <Text>
                    ④ 在命令行打开隧道文件的目录
                    <br />
                    启动执行 “wg-quick up ./
                    {userWgInfo?.tunnel_name}.conf”
                    <br />
                    关闭执行 “wg-quick down ./
                    {userWgInfo?.tunnel_name}.conf”
                  </Text>
                </Box>
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>

        <Box mt={5}>
          <Text>
            ⑤ WG隧道打开后<HighLight>等5秒</HighLight>再点刷新
          </Text>

          <Flex align="center" mt={1} gap={2}>
            <Text
              fontSize={18}
              fontWeight="bold"
              color={getStatusColor(isOnline)}
            >
              &emsp;{isOnline ? "恭喜！WG已连接" : "WG尚未连接"}
            </Text>

            <Button
              bg="transparent"
              h={5}
              px={0}
              disabled={disableFlush}
              onClick={() => {
                getRoomData(false);
              }}
              color="#7dd4ff"
            >
              <Text>刷新</Text>
              <Box animation={rotate ? `${spin} 1s linear infinite` : "none"}>
                <TbReload size={18} />
              </Box>
            </Button>
          </Flex>

          {isOnline === false && (
            <Text>
              &emsp;隧道打开了还是未连接
              <Button
                ml={1}
                variant="link"
                bg="transparent"
                color="#7dd4ff"
                onClick={() => {
                  navigate("/offlineCheck");
                }}
              >
                点我排查
              </Button>
            </Text>
          )}

          <Text mt={5}>
            ⑥ <HighLight>喵服网页关闭不影响联机</HighLight>
            ，网页只负责创建和加入房间，WG客户端保持连接就行
            <br />
            WG部署教程到此结束，请
            <Button
              mx={1}
              variant="link"
              bg="transparent"
              color="#7dd4ff"
              onClick={() => {
                navigate("/room");
              }}
            >
              返回联机房间
            </Button>
            页面创建或加入房间
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default DocumentPage;
