"use client";

import { Button } from "@/components/universal/button";
import {
  Box,
  Heading,
  Text,
  Center,
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
  List,
  ListItem,
  Input,
  Link,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useUserStateStore } from "@/store/user-state";
import { useRouter } from "next/navigation";
import { openToast } from "@/components/universal/toast";
import NextLink from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { MdTipsAndUpdates } from "react-icons/md";
import { TbReload } from "react-icons/tb";
import { keyframes } from "@emotion/react";
import OfflineReasons from "@/components/docs/OfflineReasons";

const HighLight: React.FC<TextProps> = ({ children, ...props }) => {
  return (
    <Text as="span" color="#00ff17" fontWeight="bold" {...props}>
      {children}
    </Text>
  );
};

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

interface Article {
  path: string;
  title: string;
}

const articles: Article[] = [
  { path: "/docs/theEscapists", title: "逃脱者手游（安卓、iOS）" },
  { path: "/docs/stardewValley", title: "星露谷物语（全平台）" },
  { path: "/docs/doNotStarve", title: "饥荒联机版（全平台）" },
  { path: "/docs/slayTheSpire", title: "杀戮尖塔（全平台）" },
  { path: "/docs/terraria", title: "泰拉瑞亚（全平台）" },
  { path: "/docs/l4d2", title: "求生之路2（PC）" },
  { path: "/docs/mindustry", title: "像素工厂（全平台）" },
  // { path: "/docs/minecraft", title: "我的世界（全平台）" },
  { path: "/docs/survivalcraft", title: "生存战争（全平台）" },
  { path: "/docs/wizardOfLegend", title: "传说法师手游（安卓、iOS）" },
  { path: "/docs/isaac", title: "以撒的结合（PC）" },
  { path: "/docs/overcooked", title: "胡闹厨房（PC）" },
  { path: "/docs/machinesAtWar3", title: "机械战争3（全平台）" },
  { path: "/docs/projectZomboid", title: "僵尸毁灭工程（PC）" },
  { path: "/docs/juicyRealm", title: "恶果之地（全平台）" },
  { path: "/docs/aresVirus2", title: "阿瑞斯病毒2（全平台）" },
];

const DocumentPage = () => {
  const {
    setGoToDoc,
    confKey,
    getConfKey,
    userInfo,
    setNodeListModal,
    tunnelName,
    getRoomData,
    onlineStatus,
    rotate,
    disableFlush,
    confText,
    setOfflineReasonsModal,
  } = useUserStateStore();

  const router = useRouter();

  useEffect(() => {
    if (userInfo) {
      getConfKey();
      setGoToDoc(false);
    } else {
      setGoToDoc(true);
      openToast({ content: "请登陆后再访问教程", status: "info" });
      router.push("/me");
    }
  }, [userInfo, getConfKey, router, setGoToDoc, confText]);

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
      a.download = `${tunnelName}.conf`;
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

  const [searchTerm, setSearchTerm] = useState("");
  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  //////////////////////
  //////////////////////

  useEffect(() => {
    const hash = window.location.hash;

    if (hash) {
      // 设置一个延迟，确保页面加载完成后再执行滚动
      const timer = setTimeout(() => {
        const gamesElement = document.getElementById(hash.replace("#", ""));
        if (gamesElement) {
          window.scrollTo({
            top: gamesElement.offsetTop - 150,
            behavior: "smooth",
          });
        }
      }, 500);

      // 清理定时器
      return () => clearTimeout(timer);
    }
  }, []);
  //////////////////////
  //////////////////////

  const SelectNode = () => {
    return (
      <Box mb={1}>
        <Text>
          ① 当前选择的是&ensp;
          <Text as="span" fontWeight="bold">
            {userInfo?.node_alias}
          </Text>
          &ensp;节点
        </Text>

        <Button ml={4} onClick={setNodeListModal} size="sm">
          点击切换节点
        </Button>

        <Text>
          <Icon as={MdTipsAndUpdates} mr={2} />
          <HighLight fontSize="sm">
            后续步骤导入或下载的是{userInfo?.node_alias}
            节点的隧道，如果切换了新节点，要来这导入新节点的隧道
          </HighLight>
        </Text>

        <Text>
          <Icon as={MdTipsAndUpdates} mr={2} />
          <HighLight fontSize="sm">隧道与账号绑定，不能多个玩家共用</HighLight>
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
            if (confText) GenConfFile(confText);
            return;
          }

          const isSafari = navigator.userAgent.includes("Safari");
          if (isSafari) {
            if (confText) GenConfFile(confText);
          } else {
            openToast({
              content: "请在Safari中打开网站下载",
              status: "warning",
            });
          }
        }}
        isDisabled={userInfo ? false : true}
      >
        点击下载{userInfo?.node_alias}隧道文件
      </Button>
    );
  };

  return (
    <Box px={5}>
      <OfflineReasons />

      <Heading size="md" pb={2} color="#00ff17">
        如果你是第一次用组网软件，需要点耐心和细心看完教程
      </Heading>

      <Text my={2}>
        <Icon as={MdTipsAndUpdates} mr={2} />
        使用喵服联机的玩家都要注册账号，并跟着教程安装WG客户端、导入隧道
      </Text>

      <Text my={2}>
        <Icon as={MdTipsAndUpdates} mr={2} />
        手机、电脑都能安装WG客户端，要安装在运行游戏的设备上
      </Text>

      <Text>
        <Icon as={MdTipsAndUpdates} mr={2} />
        底层是Linux的设备也能接入，如Steam Deck掌机，教程自己查询或联系服主
      </Text>

      <Box mt={5} display={tunnelName === undefined ? "hidden" : "block"}>
        {/* <Heading size="md" pb={2} color="#00ff17">
          2. WG下载和隧道导入
        </Heading>*/}

        <Tabs variant="line">
          <Heading size="md" color="#00ff17">
            选择设备类型
          </Heading>

          <TabList
            mt={1}
            display="inline-flex" // 改为 inline-flex
            alignItems="center" // 确保标签对齐
            maxW="fit-content" // 限制宽度
          >
            <Tab
              py={1}
              fontWeight="bolder"
              _selected={{ color: "white", bg: "blue.600" }}
            >
              安卓
            </Tab>
            <Tab
              py={1}
              fontWeight="bolder"
              _selected={{ color: "white", bg: "blue.600" }}
            >
              苹果
            </Tab>
            <Tab
              py={1}
              fontWeight="bolder"
              _selected={{ color: "white", bg: "blue.600" }}
            >
              Windows
            </Tab>
            <Tab
              py={1}
              fontWeight="bolder"
              _selected={{ color: "white", bg: "blue.600" }}
            >
              Mac
            </Tab>
          </TabList>

          <TabPanels>
            {/* 安卓 */}
            <TabPanel px={0} pb={1} pt={2}>
              {/* <HighLight>
                注意！WG不兼容鸿蒙6系统，不过可以联系服主了解其他联机方式
              </HighLight> */}

              <SelectNode />

              <Text mt={5}>
                ② 下载并安装WG客户端
                <Text
                  as="span"
                  color="#7dfffe"
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
                  color="#7dfffe"
                  onClick={() => {
                    getConfKey();
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
                &emsp;导入的隧道名称应是 “{tunnelName}”
              </Text>

              <Box mt={5}>
                ④ 打开隧道开关，就连上喵服了
                <Flex>
                  &emsp;开关长这样=&gt;
                  <Image
                    mx={1}
                    maxH="1.5rem"
                    src="/images/wg/android_switch.jpg"
                    alt="android_switch"
                  />
                </Flex>
              </Box>
              <Flex alignItems="center" mt={1}>
                &emsp;<HighLight>小米/红米设备要改个设置</HighLight>
                <Text
                  ml={2}
                  as="span"
                  color="#7dfffe"
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
                  src="/images/wg/xiaomi.jpg"
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
                  src="/images/wg/app_store.jpg"
                  alt="app_store"
                  borderRadius="md"
                  w="100%"
                  maxW="300px"
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
                      {tunnelName}
                    </Text>

                    <Box borderWidth={5} borderColor="white" w="min">
                      <QRCodeSVG size={256} value={confText as string} />
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
                      {tunnelName}
                      .conf”，然后点左下角发送到WG
                      <br />
                      或者，到WG里导入配置也行
                    </Text>
                  </TabPanel>
                </TabPanels>
              </Tabs>

              <Box mt={5}>
                ④ 打开隧道开关，就连上喵服了
                <Flex ml={4}>
                  开关长这样=&gt;
                  <Image
                    mx={1}
                    maxH="1.5rem"
                    src="/images/wg/iOS_switch.jpg"
                    alt="iOS_switch"
                  />
                </Flex>
                <Text fontSize="sm">
                  如果出现DBS解析失败，并重新打开几次都不行，就换个网络再试
                </Text>
              </Box>
            </TabPanel>

            {/* windows */}
            <TabPanel px={0} pb={1} pt={2}>
              <SelectNode />

              <Text mt={5}>
                ② 下载并安装WG客户端，如果双击无法安装，
                <Link
                  ml={1}
                  color="#7dd4ff"
                  href="https://zhuanlan.zhihu.com/p/589250265"
                  target="_blank"
                >
                  点我查看解决方法
                </Link>
                <br />
                如果文件下载失败，就加Q群924644467，群文件有
              </Text>

              <Button
                size="sm"
                mx={2}
                onClick={() => {
                  window.open("/apks/wireguard-amd64-0.5.3.msi", "_blank");
                }}
              >
                点击下载安装包
              </Button>

              <Box mt={5}>
                ③ 下载隧道文件，文件名为“{tunnelName}
                .conf”
              </Box>
              {DownloadButton()}

              <Text mt={5}>
                ④ 跟着下图操作完成隧道导入，看红字就行
                <br />
                默认不创建桌面快捷方式，如果需要自己去系统开始菜单里找到WG手动创建
                <Flex alignItems="center" mt={1}>
                  &emsp;<HighLight>点连接后出现“隧道错误”的处理方法</HighLight>
                  <Text
                    ml={2}
                    as="span"
                    color="#7dfffe"
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
                      color="#7dfffe"
                      onClick={() => {
                        window.open("/apks/右键以管理员身份运行.bat", "_blank");
                      }}
                    >
                      点击下载bat修复文件
                    </Text>
                    ，然后右键“以管理员身份运行”修复。如果还是不行，就按下图指引“网络重置”试试
                  </Text>
                  <Image
                    src="/images/wg/network_reset.png"
                    alt="network_reset"
                    borderRadius="md"
                    maxW="500px"
                    mb={10}
                  />
                </Collapse>
              </Text>
              <Image
                src="/images/wg/win_msi.jpg"
                alt="win_msi"
                borderRadius="md"
                w="100%"
                maxW="500px"
              />
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
                  src="/images/wg/app_store_mac.jpg"
                  alt="app_store_mac"
                  borderRadius="md"
                  w="100%"
                  maxW="300px"
                />
              </Box>

              <Box mt={5}>③ 下载隧道文件，文件名为“{tunnelName}.conf”</Box>
              {DownloadButton()}

              <Box mt={5}>
                <Text>④ 运行WG，跟着下图操作完成隧道导入，看红字就行</Text>
                <Image
                  src="/images/wg/mac.jpg"
                  alt="mac"
                  borderRadius="md"
                  w="100%"
                  maxW="500px"
                />
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>

      <Box mt={5}>
        ⑤ WG隧道打开后<HighLight>等5秒</HighLight>点刷新，在线就可以了
        <Flex align="center">
          &emsp;
          <Text
            mr={1}
            fontWeight="bold"
            color={onlineStatus === "在线" ? "#3fdb1d" : "#ff0000"}
          >
            {onlineStatus}
          </Text>
          <Button
            bg="transparent"
            h={5}
            px={0}
            disabled={disableFlush}
            onClick={() => {
              getRoomData(false);
            }}
            ml={1}
            color="#7dd4ff"
          >
            <Text>刷新</Text>
            <Box animation={rotate ? `${spin} 1s linear infinite` : "none"}>
              <TbReload size={18} />
            </Box>
          </Button>
        </Flex>
        &emsp;如果WG隧道打开还是离线👉
        <Button
          variant="link"
          bg="transparent"
          color="#7dd4ff"
          onClick={setOfflineReasonsModal}
        >
          点我排查
        </Button>
        
        <Text>喵服网页关闭不影响联机，网页只负责创建和加入房间，WG客户端保持连接就行</Text>
      </Box>

      <Box id="games" mt={5}>
        <Text>
          ⑥
          在下方列表中的游戏就是明确支持联机的，游戏名旁边的括号表示支持什么系统平台。
          <HighLight>点击游戏名阅读联机操作指导</HighLight>
          ，没有的游戏请自行尝试或加群1047464328找群(即服主)询问
        </Text>
        <Box>
          <Input
            placeholder="搜索游戏教程"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            mt={2}
          />
          <Box maxHeight="240px" overflowY="auto">
            <List>
              {filteredArticles.map((article) => (
                <ListItem key={article.path} my={1}>
                  <Link
                    fontSize="md"
                    as={NextLink}
                    href={article.path}
                    color="#7dfffe"
                    _hover={{ textDecoration: "none" }}
                  >
                    {article.title}
                  </Link>
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      </Box>

      <Center>
        <Button
          bgColor="#b23333"
          onClick={() => {
            router.push(`/room`);
          }}
          my={6}
          w="10rem"
        >
          返回联机房间
        </Button>
      </Center>

      {/* {showScroll && (
        <Button
          position="fixed"
          bottom="12vh"
          right="20px"
          onClick={scrollToTop}
          size="sm"
          fontSize="md"
          px={2}
          zIndex={200}
        >
          目录
        </Button>
      )} */}
    </Box>
  );
};

export default DocumentPage;
