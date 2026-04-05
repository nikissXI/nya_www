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
import { Link as ScrollLink } from "react-scroll";
import { useUserStateStore } from "@/store/user-state";
import { useRouter } from "next/navigation";
import { openToast } from "@/components/universal/toast";
import NextLink from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { MdTipsAndUpdates } from "react-icons/md";
import { TbReload } from "react-icons/tb";
import { keyframes } from "@emotion/react";
import { GiNetworkBars } from "react-icons/gi";
import OfflineReasons from "@/components/docs/OfflineReasons";

interface TableOfContentsLinkProps {
  to: string;
  children: React.ReactNode;
}

const ScrollLinkM: React.FC<TableOfContentsLinkProps> = ({ to, children }) => {
  return (
    <ScrollLink to={to} smooth={true} duration={500} offset={-100}>
      <Text>{children}</Text>
    </ScrollLink>
  );
};

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

function getColor(latency: number) {
  if (latency > 100) return "#ffa524";
  else if (latency > 0) return "#3fdb1d";
  else return "#ff3b3b";
}

interface Article {
  path: string;
  title: string;
}

const articles: Article[] = [
  { path: "/docs/theEscapists", title: "逃脱者手游（安卓、iOS）" },
  { path: "/docs/stardewValley", title: "星露谷物语（全平台）" },
  { path: "/docs/terraria", title: "泰拉瑞亚（全平台）" },
  { path: "/docs/slayTheSpire", title: "杀戮尖塔（全平台）" },
  { path: "/docs/l4d2", title: "求生之路2（PC）" },
  { path: "/docs/minecraft", title: "我的世界（全平台）" },
  { path: "/docs/survivalcraft", title: "生存战争（全平台）" },
  { path: "/docs/wizardOfLegend", title: "传说法师手游（安卓、iOS）" },
  { path: "/docs/isaac", title: "以撒的结合（PC）" },
  { path: "/docs/overcooked", title: "胡闹厨房（PC）" },
  { path: "/docs/doNotStarve", title: "饥荒（PC）" },
  { path: "/docs/mindustry", title: "像素工厂（全平台）" },
  { path: "/docs/machinesAtWar3", title: "机械战争3（全平台）" },
  { path: "/docs/projectZomboid", title: "僵尸毁灭工程（PC）" },
  { path: "/docs/juicyRealm", title: "恶果之地（全平台）" },
  { path: "/docs/aresVirus2", title: "阿瑞斯病毒2（全平台）" },
];

const DocumentPage = () => {
  const {
    setGoToIssues,
    confKey,
    getConfKey,
    userInfo,
    setNodeListModal,
    tunnelName,
    roomData,
    getRoomData,
    setRoomData,
    roomRole,
    latency,
    getTunnel,
    onlineStatus,
    rotate,
    disableFlush,
    setShowLoginModal,
    setOfflineReasonsModal,
  } = useUserStateStore();

  const router = useRouter();

  useEffect(() => {
    if (userInfo?.wg_data) {
      getConfKey();
      setGoToIssues(false);
    } else {
      setGoToIssues(true);
      openToast({ content: "请登陆后再访问教程", status: "info" });
      router.push("/me");
    }
  }, [userInfo, getConfKey, router, setGoToIssues]);

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
  const [showScroll, setShowScroll] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 150) {
      setShowScroll(true);
    } else {
      setShowScroll(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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

    if (hash === "#download") {
      // 设置一个延迟，确保页面加载完成后再执行滚动
      const timer = setTimeout(() => {
        const gamesElement = document.getElementById("download");
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
            {userInfo?.wg_data?.node_alias}
          </Text>
          &ensp;节点
        </Text>

        <Button ml={4} onClick={setNodeListModal} size="sm">
          点击切换节点
        </Button>

        <Text>
          <Icon as={MdTipsAndUpdates} mr={2} />
          <HighLight fontSize="sm">
            后续步骤导入或下载的是{userInfo?.wg_data?.node_alias}
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
            if (userInfo?.wg_data) GenConfFile(userInfo.wg_data.conf_text);
            return;
          }

          const isSafari = navigator.userAgent.includes("Safari");
          if (isSafari) {
            if (userInfo?.wg_data) GenConfFile(userInfo.wg_data.conf_text);
          } else {
            openToast({
              content: "请在Safari中打开网站下载",
              status: "warning",
            });
          }
        }}
        isDisabled={userInfo ? false : true}
      >
        点击下载{userInfo?.wg_data?.node_alias}隧道文件
      </Button>
    );
  };

  return (
    <Box px={5}>
      <OfflineReasons />
      {/* <Box>
          <Heading size="md" pb={2} color="#00ff17">
            目录（点击可跳转）
          </Heading>
          <VStack spacing={2} align="start" color="#7dfffe">
            <ScrollLinkM to="notice">1. 前言</ScrollLinkM>
            <ScrollLinkM to="download">2. WG下载和隧道导入</ScrollLinkM>
            <ScrollLinkM to="games">3. 具体游戏联机教程(必看)</ScrollLinkM>
          </VStack>
        </Box>

        <Divider /> */}

      <Heading size="md" pb={2} color="#00ff17">
        如果你是第一次用组网软件，需要点耐心和细心看完教程
      </Heading>

      <Text my={2}>
        <Icon as={MdTipsAndUpdates} mr={2} />
        使用喵服联机的玩家都要注册账号，并跟着教程安装WG客户端、导入隧道
      </Text>

      <Text>
        <Icon as={MdTipsAndUpdates} mr={2} />
        手机、电脑都能安装WG客户端，要安装在运行游戏的设备上
      </Text>

      <Box
        mt={5}
        id="download"
        display={tunnelName === undefined ? "hidden" : "block"}
      >
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
                  window.open(process.env.NEXT_PUBLIC_WG_APK_URL, "_blank");
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
                ，如果没有海外账号，这网站里有
                <Link
                  href="https://id.ali-door.top/share/damaiye"
                  color="#7dfffe"
                  target="_blank"
                >
                  https://id.ali-door.top/share/damaiye
                </Link>
                ，或者自己去注册或租一个
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
                      <QRCodeSVG
                        size={256}
                        value={userInfo?.wg_data?.conf_text as string}
                      />
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
              <Tabs variant="line" colorScheme="orange">
                <Text fontWeight="bolder">
                  客户端有msi和exe两种安装包 ，如果msi不能安装就用exe
                </Text>
                <TabList
                  mt={1}
                  display="inline-flex"
                  alignItems="center"
                  maxW="fit-content"
                >
                  <Tab
                    py={1}
                    fontWeight="bolder"
                    _selected={{ color: "white", bg: "blue.600" }}
                  >
                    msi(推荐)
                  </Tab>
                  <Tab
                    py={1}
                    fontWeight="bolder"
                    _selected={{ color: "white", bg: "blue.600" }}
                  >
                    exe
                  </Tab>
                </TabList>

                <TabPanels>
                  <TabPanel px={0} pb={0} pt={1}>
                    <SelectNode />

                    <Text mt={5}>② 下载msi运行并安装</Text>
                    <Button
                      size="sm"
                      mx={2}
                      onClick={() => {
                        window.open(
                          process.env.NEXT_PUBLIC_WG_MSI_URL,
                          "_blank",
                        );
                      }}
                    >
                      点击下载msi
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
                      <br />
                      如果无法连接并且电脑安装过vmvare，就下载这个bat文件，
                      <Text
                        as="span"
                        color="#7dfffe"
                        onClick={() => {
                          window.open(
                            process.env.NEXT_PUBLIC_BAT_FIX_URL,
                            "_blank",
                          );
                        }}
                      >
                        点击下载
                      </Text>
                      ，然后右键“以管理员身份运行”修复
                    </Text>
                    <Image
                      src="/images/wg/win_msi.jpg"
                      alt="win_msi"
                      borderRadius="md"
                      w="100%"
                      maxW="500px"
                    />
                  </TabPanel>

                  <TabPanel px={0} pb={0} pt={1}>
                    <SelectNode />

                    <Text mt={5}>② 下载exe安装包</Text>
                    <Button
                      size="sm"
                      mx={2}
                      onClick={() => {
                        window.open(
                          process.env.NEXT_PUBLIC_WG_EXE_URL,
                          "_blank",
                        );
                      }}
                    >
                      点击下载exe
                    </Button>

                    <Box mt={5}>
                      ③ 下载隧道文件，文件名为“{tunnelName}
                      .conf”
                    </Box>
                    {DownloadButton()}

                    <Text mt={5}>
                      ④ 双击运行安装后，跟着下图操作完成隧道导入，看红字就行
                    </Text>
                    <Image
                      src="/images/wg/win_exe.jpg"
                      alt="win_exe"
                      borderRadius="md"
                      w="100%"
                      maxW="500px"
                    />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </TabPanel>

            {/* MAC */}
            <TabPanel px={0} pb={1} pt={2}>
              <SelectNode />

              <Box mt={5}>
                ② 安装WG客户端，
                <HighLight>AppStore要登陆海外账号才能搜到</HighLight>
                ，如果没有海外账号，这网站里有
                <Link
                  href="https://id.ali-door.top/share/damaiye"
                  color="#7dfffe"
                  target="_blank"
                >
                  https://id.ali-door.top/share/damaiye
                </Link>
                ，或者自己去注册或租一个
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
        &emsp;WG隧道打开还是离线👉
        <Button
          variant="link"
          bg="transparent"
          color="#7dd4ff"
          onClick={setOfflineReasonsModal}
        >
          点我排查
        </Button>
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
