"use client";

import { Button } from "@/components/universal/button";
import {
  Box,
  Heading,
  Text,
  VStack,
  Divider,
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
    <Text as="span" color="#ff734f" fontWeight="bold" {...props}>
      {children}
    </Text>
  );
};

interface Article {
  path: string;
  title: string;
}

const articles: Article[] = [
  { path: "/docs/theEscapists", title: "逃脱者（必须看!!）（安卓、iOS）" },
  { path: "/docs/juicyRealm", title: "恶果之地（全平台）" },
  { path: "/docs/aresVirus2", title: "阿瑞斯病毒2（全平台）" },
  { path: "/docs/stardewValley", title: "星露谷物语（全平台）" },
  { path: "/docs/wizardOfLegend", title: "传说法师1（安卓、iOS）" },
  { path: "/docs/doNotStarve", title: "饥荒（PC）" },
  { path: "/docs/minecraft", title: "我的世界（全平台）" },
  { path: "/docs/terraria", title: "泰拉瑞亚（全平台）" },
  { path: "/docs/l4d2", title: "求生之路2（PC）" },
  { path: "/docs/projectZomboid", title: "僵尸毁灭工程（PC）" },
];

const DocumentPage = () => {
  const {
    setGoToIssues,
    confKey,
    getConfKey,
    userInfo,
    setNodeListModal,
    tunnelName,
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
    article.title.toLowerCase().includes(searchTerm.toLowerCase())
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
        点击下载隧道文件
      </Button>
    );
  };

  return (
    <Box px={5}>
      <VStack spacing={5} align="stretch">
        <HighLight fontSize="24px">
          网上的视频教程不一定是最新的，以本网站的图文教程为准，你少看一行都可能无法联机
        </HighLight>

        <Box>
          <Heading size="md" pb={2} color="#00ff17">
            目录（点击可跳转）
          </Heading>
          <VStack spacing={2} align="start" color="#7dfffe">
            <ScrollLinkM to="introduction">1. 喵服简介</ScrollLinkM>
            <ScrollLinkM to="words">2. 联机常用词</ScrollLinkM>
            <ScrollLinkM to="download">3. WG下载和隧道导入</ScrollLinkM>
            <ScrollLinkM to="room">4. 联机房间说明</ScrollLinkM>
            <ScrollLinkM to="games">5. 具体游戏联机教程(很重要)</ScrollLinkM>
            <ScrollLinkM to="issues">6. 常见问题/联机失败</ScrollLinkM>
          </VStack>
        </Box>

        <Divider />

        <Box id="introduction">
          <Heading size="md" pb={2} color="#00ff17">
            1. 喵服简介
          </Heading>
          <Text>
            &emsp;&emsp;喵服是
            <HighLight>免费</HighLight>
            提供组网联机服务的联机平台，说人话就是整着玩的不求盈利。如果看不懂使用教程或不会用，可尝试加QQ交流群寻求帮助，也可以赞助10元找服主一对一教学
            <Link
              ml={1}
              color="#7dfffe"
              fontWeight="bold"
              as={NextLink}
              href="/sponsor"
              _hover={{ textDecoration: "none" }}
            >
              点我赞助
            </Link>
          </Text>
          <Text>
            &emsp;&emsp;喵服是个WireGuard（简称WG）服务器，WG是个组网软件，俗称VPN，通过它
            <HighLight>可近似实现“连上同一个WiFi”，实现异地联机。</HighLight>
          </Text>
          <Text>
            &emsp;&emsp;
            <HighLight>
              使用喵服联机的玩家都要注册并连上喵服，导入自己的WG隧道文件
            </HighLight>
            ，所有手机、平板、电脑都能接入喵服，但能不能跨平台联机得看游戏是否支持，本文档《4.开始联机》部分有详细说明。
          </Text>
        </Box>

        <Box id="words">
          <Heading size="md" pb={2} color="#00ff17">
            2. 联机常用词
          </Heading>
          <Text>
            &emsp;眼熟一些常用的词，防止请教别人联机问题的时候，看不懂别人在问什么，也便于你学习本文档。
          </Text>
          <Text>
            <HighLight>主机</HighLight>
            ：联机模式创建游戏的设备。
          </Text>
          <Text>
            <HighLight>客机</HighLight>
            ：联机模式加入游戏的设备。
          </Text>
          <Text>
            <HighLight>隧道</HighLight>
            ：连接喵服的WG配置文件，每个账号有自己的隧道文件，不能使用其他账号的。
          </Text>
          <Text>
            <HighLight>防火墙</HighLight>
            ：Windows系统才有的东西，如果电脑做主机，其他玩家无法加入试试把它关了。
          </Text>
        </Box>

        <Box
          id="download"
          display={tunnelName === undefined ? "hidden" : "block"}
        >
          <Heading size="md" pb={2} color="#00ff17">
            3. WG下载和隧道导入
          </Heading>

          <HighLight>
            别把自己账号的隧道给其他人导入！
            <br />
            每个节点的隧道都要单独导入！
            <br />
            别把自己账号的隧道给其他人导入！
            <br />
            每个节点的隧道都要单独导入！
            <br />
            别把自己账号的隧道给其他人导入！
            <br />
            每个节点的隧道都要单独导入！
          </HighLight>

          <Tabs variant="line" colorScheme="orange">
            <Text pt={2} fontWeight="bolder" ml="1rem">
              选择你要安装WG的系统类型
            </Text>
            <Flex align="center" borderRadius="md" boxShadow="sm" ml="1rem">
              <Text fontWeight="medium" fontSize="md" mr={2}>
                当前选择联机的节点：
                <Text as="span" fontWeight="bold">
                  {userInfo?.wg_data?.node_alias}
                </Text>
              </Text>
              <Button rounded="md" onClick={setNodeListModal} size="sm">
                切换
              </Button>
            </Flex>

            <TabList
              mt={1}
              display="inline-flex" // 改为 inline-flex
              alignItems="center" // 确保标签对齐
              maxW="fit-content" // 限制宽度
            >
              <Tab
                py={1}
                fontWeight="bolder"
                _selected={{ color: "white", bg: "green.600" }}
              >
                安卓
              </Tab>
              <Tab
                py={1}
                fontWeight="bolder"
                _selected={{ color: "white", bg: "green.600" }}
              >
                iOS
              </Tab>
              <Tab
                py={1}
                fontWeight="bolder"
                _selected={{ color: "white", bg: "green.600" }}
              >
                Win
              </Tab>
              <Tab
                py={1}
                fontWeight="bolder"
                _selected={{ color: "white", bg: "green.600" }}
              >
                Mac
              </Tab>
            </TabList>

            <TabPanels>
              {/* 安卓 */}
              <TabPanel px={0} pb={1} pt={2}>
                <VStack spacing={3} align="stretch">
                  <Box>
                    <Flex alignItems="center">
                      <Text>1. 安装WG客户端</Text>
                      <Button
                        h="1.6rem"
                        ml={3}
                        px={2}
                        size="sm"
                        onClick={() => {
                          window.open(
                            process.env.NEXT_PUBLIC_WG_APK_URL,
                            "_blank"
                          );
                        }}
                      >
                        下载安装包
                      </Button>
                    </Flex>

                    <Text
                      as="span"
                      color="#7dfffe"
                      onClick={() => {
                        setAndroidDLWarning(!showAndroidDLWarning);
                      }}
                    >
                      &emsp;如果下载不了，点我
                    </Text>

                    <Collapse in={showAndroidDLWarning}>
                      <Text fontSize="sm">
                        &emsp;到浏览器打开网站再下载，无法下载的都是因为在QQ、微信这些非浏览器应用中下载。
                      </Text>
                    </Collapse>
                  </Box>

                  <Box pb={1}>
                    2. 复制黄字，这是conf key
                    <Text
                      ml={1}
                      as="span"
                      color="#7dfffe"
                      onClick={() => {
                        getConfKey();
                      }}
                    >
                      如果失效，点我刷新
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
                    3.
                    打开WG，点右下角加号，选“通过conf_key导入”，粘贴黄字完成隧道导入。
                    <br />
                    &emsp;导入的隧道名称应是 “{tunnelName}”
                    <br />
                    <HighLight>
                      &emsp;必须使用这里下载的WG，否则没有“通过conf_key导入”的选项
                    </HighLight>
                  </Text>

                  <Box>
                    4. 打开隧道开关，就连上喵服了
                    <Flex ml={4}>
                      开关长这样=&gt;
                      <Image
                        mx={1}
                        maxH="1.5rem"
                        src="/images/wg/android_switch.jpg"
                        alt="android_switch"
                      />
                    </Flex>
                  </Box>

                  <Flex alignItems="center">
                    <HighLight>小米/红米设备要改个设置</HighLight>
                    <Button
                      h="1.6rem"
                      ml={3}
                      px={2}
                      size="sm"
                      onClick={() => setShowXM(!showXM)}
                    >
                      {showXM ? "点击收起" : "点击查看"}
                    </Button>
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
                </VStack>
              </TabPanel>

              {/* iOS */}
              <TabPanel px={0} pb={1} pt={2}>
                <Box>
                  1. 安装WG客户端，
                  <HighLight>AppStore要登陆海外账号才能搜到</HighLight>
                  ，如果没有海外账号自己去闲鱼或pdd之类的搜“苹果游戏”搞一个账号（最好是美区的），或自己想其他办法，海外账号都没有用什么苹果
                  <Image
                    src="/images/wg/app_store.jpg"
                    alt="app_store"
                    borderRadius="md"
                    w="100%"
                    maxW="300px"
                  />
                </Box>

                <Tabs variant="line" colorScheme="orange">
                  <Text pt={2} fontWeight="bolder">
                    iOS导入隧道有扫码和下载两种方法，看情况选择
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
                      _selected={{ color: "white", bg: "green.600" }}
                    >
                      扫二维码
                    </Tab>
                    <Tab
                      py={1}
                      fontWeight="bolder"
                      _selected={{ color: "white", bg: "green.600" }}
                    >
                      下载隧道
                    </Tab>
                  </TabList>

                  <TabPanels>
                    <TabPanel px={0} pb={0} pt={1}>
                      <HighLight>
                        不支持从相册导入二维码，所以自己想办法扫（比如借个设备拍下来再扫），扫不了就选“下载隧道”的方法
                      </HighLight>

                      <Text>
                        2.
                        打开WG，点右上角+号，扫描二维码，隧道名称随意，你自己知道这是哪个节点就行
                      </Text>

                      <Box borderWidth={5} borderColor="white" w="min">
                        <QRCodeSVG
                          size={256}
                          value={userInfo?.wg_data?.conf_text as string}
                        />
                      </Box>
                    </TabPanel>

                    <TabPanel px={0} pb={0} pt={1}>
                      <HighLight>建议使用Safari浏览器访问网站再下载</HighLight>

                      <Text>2. 下载隧道文件</Text>
                      {DownloadButton(true)}

                      <Text pt={1}>
                        打开浏览器的下载任务列表，点击文件“
                        {tunnelName}
                        .conf”，然后点左下角发送到WG完成导入
                      </Text>
                    </TabPanel>
                  </TabPanels>
                </Tabs>

                <Box pt={3}>
                  3. 打开隧道开关，就连上喵服了
                  <Flex ml={4}>
                    开关长这样=&gt;
                    <Image
                      mx={1}
                      maxH="1.5rem"
                      src="/images/wg/iOS_switch.jpg"
                      alt="iOS_switch"
                    />
                  </Flex>
                  出现DBS解析失败是因为没给WG访问网络的权限，如果已经给权限就换个网络试试。
                </Box>
              </TabPanel>

              {/* windows */}
              <TabPanel px={0} pb={1} pt={2}>
                <Box>
                  1. 下载隧道文件，文件名为“{tunnelName}.conf”
                  <br />
                  {DownloadButton()}
                </Box>

                <Tabs variant="line" colorScheme="orange">
                  <Text pt={2} fontWeight="bolder">
                    2. 客户端有msi和exe两种安装包，二选一，
                    <HighLight>优先选择msi</HighLight>
                    ，如果msi不能正常使用就换exe。
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
                      _selected={{ color: "white", bg: "green.600" }}
                    >
                      msi
                    </Tab>
                    <Tab
                      py={1}
                      fontWeight="bolder"
                      _selected={{ color: "white", bg: "green.600" }}
                    >
                      exe
                    </Tab>
                  </TabList>

                  <TabPanels>
                    <TabPanel px={0} pb={0} pt={1}>
                      <Flex alignItems="center">
                        <Text>3. 下载msi安装包</Text>
                        <Button
                          size="sm"
                          mx={2}
                          onClick={() => {
                            window.open(
                              process.env.NEXT_PUBLIC_WG_MSI_URL,
                              "_blank"
                            );
                          }}
                        >
                          点击下载
                        </Button>
                      </Flex>

                      <Text>
                        4.
                        双击运行安装后，跟着下图操作完成隧道导入，看红字就行，其他内容不用管
                      </Text>
                      <Image
                        src="/images/wg/win_msi.jpg"
                        alt="win_msi"
                        borderRadius="md"
                        w="100%"
                        maxW="500px"
                      />
                      <Text>
                        默认不创建桌面快捷方式，如果需要自己去系统开始菜单里找到WG手动创建。
                        <br />
                        如果提示“隧道名称无效”就检测是否有中文字符或括号，改个名字再导入。
                      </Text>
                      {/* <Text>
                        <HighLight>点连接出现报错？</HighLight>

                        <Text
                          as="span"
                          color="#7dfffe"
                          onClick={() => {
                            setWinError(!showWinError);
                          }}
                        >
                          点我解决
                        </Text>
                      </Text>

                      <Collapse in={showWinError}>
                        <Text fontSize="sm">
                          &emsp;如果连接出现报错“Unable to create network
                          adapter”，就下载这个bat文件，
                          <Text
                            as="span"
                            fontSize="sm"
                            color="#7dfffe"
                            onClick={() => {
                              window.open(
                                process.env.NEXT_PUBLIC_BAT_FIX_URL,
                                "_blank"
                              );
                            }}
                          >
                            点击下载bat
                          </Text>
                          ，然后右键“以管理员身份运行”修复，这通常是因为安装过vm虚拟机导致的。
                          <br />
                          &emsp;如果是其他错误或运行bat后仍然连接报错，就尝试安装exe。
                        </Text>
                      </Collapse> */}
                    </TabPanel>

                    <TabPanel px={0} pb={0} pt={1}>
                      <Flex alignItems="center">
                        <Text>3. 下载exe安装包</Text>
                        <Button
                          size="sm"
                          mx={2}
                          onClick={() => {
                            window.open(
                              process.env.NEXT_PUBLIC_WG_EXE_URL,
                              "_blank"
                            );
                          }}
                        >
                          点击下载
                        </Button>
                      </Flex>

                      <Text>
                        4.
                        双击运行安装后，跟着下图操作完成隧道导入，看红字就行，其他内容不用管
                      </Text>
                      <Image
                        src="/images/wg/win_exe.jpg"
                        alt="win_exe"
                        borderRadius="md"
                        w="100%"
                        maxW="500px"
                      />
                      <Text>如果连接还是报错那就找服主看看或别用了。</Text>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </TabPanel>

              {/* MAC */}
              <TabPanel px={0} pb={1} pt={2}>
                <VStack spacing={3} align="stretch">
                  <Box>
                    1. 安装WG客户端，
                    <HighLight>AppStore要登陆海外账号才能搜到</HighLight>
                    ，如果没有海外账号自己去闲鱼或pdd之类的搜“苹果游戏”搞一个账号（最好是美区的），或自己想其他办法，海外账号都没有用什么苹果
                    <Image
                      src="/images/wg/app_store_mac.jpg"
                      alt="app_store_mac"
                      borderRadius="md"
                      w="100%"
                      maxW="300px"
                    />
                  </Box>

                  <Box>
                    2. 下载隧道文件，文件名为“{tunnelName}.conf”
                    <br />
                    {DownloadButton()}
                  </Box>

                  <Box>
                    <Text>
                      3.
                      运行WG，跟着下图操作完成隧道导入，看红字就行，其他内容不用管
                    </Text>
                    <Image
                      src="/images/wg/mac.jpg"
                      alt="mac"
                      borderRadius="md"
                      w="100%"
                      maxW="500px"
                    />
                  </Box>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>

        <Box id="room">
          <Heading size="md" pb={2} color="#00ff17">
            4. 联机房间说明
          </Heading>
          <Text>
            联机房间页面功能介绍看图；在一个联机房间里，谁都可以作为主机创建多人游戏，其他人则作为客机加入游戏
          </Text>
          <Image
            src="/images/wg/room_introduction_1.jpg"
            alt="room_introduction_1"
            border="2px"
            borderColor="#ff734f"
            borderRadius="md"
            w="100%"
            maxW="500px"
          />
          <Image
            src="/images/wg/room_introduction_2.jpg"
            alt="room_introduction_2"
            border="2px"
            borderColor="#ff734f"
            borderRadius="md"
            w="100%"
            maxW="500px"
          />
        </Box>

        <Box id="games">
          <Heading size="md" pb={2} color="#00ff17">
            5. 具体游戏联机教程(很重要)
          </Heading>
          <Text>
            &emsp;&emsp;
            <HighLight>
              支持填IP加入（P2P）的游戏都支持使用喵服联机，通过局域网搜索的部分支持。
            </HighLight>
            在下方列表中的游戏就是明确支持联机的，游戏名旁边的括号表示支持什么系统平台，点击游戏名查看具体的联机操作指导，没有的游戏请自行尝试。
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

        <Box id="issues">
          <Heading size="md" pb={2} color="#00ff17">
            6. 常见问题/联机失败
          </Heading>

          <VStack spacing={2} align="stretch">
            <Text>
              <HighLight>问：不会用/看不懂</HighLight>
              <br />
              答：开发维护服务器已经很累人，没时间做免费解答（有钱的可以赞助10元找服主一对一教），教程已经很详细，自己认真看，也可以自己进群找人问。
            </Text>

            <Text>
              <HighLight>问：某游戏能不能联机/不同平台能否联机</HighLight>
              <br />
              答：看本页面第5部分。
            </Text>

            <Text>
              <HighLight>问：WG连上了但还是离线</HighLight>
              <br />
              答：（1）检查导入的是不是自己账号的隧道，每个隧道对应一个账号，不能共用。（2）检查导入的隧道是否对应你选择的节点，每个节点都要导入一次隧道。（3）部分企业或校园网络会拦截WG的流量，尝试切换其他网络试试，如使用移动流量。
            </Text>

            <Text>
              <HighLight>问：海外或跨国能否使用</HighLight>
              <br />
              答：只有线路类型是海外的节点支持跨国和海外用户使用，但不能100%保证稳定性（尤其远距离跨国）。如有其他需要请联系服主购买针对性服务。
            </Text>

            <Text>
              <HighLight>问：联机失败/搜索不到游戏</HighLight>
              <br />
              答：（1）玩家需要都在线，并在同一个联机房间里。（2）如果主机是Windows，试试把系统防火墙都关闭。（3）加入游戏的时候，主机要在游戏里，游戏放后台客机将无法加入。（4）试试换个人做主机或重开游戏，有的游戏有BUG得重开游戏。（5）重新认真阅读本文档全部内容，尤其是第5部分。
            </Text>

            <Text>
              <HighLight>问：浏览器（喵服网站）可以关闭吗？</HighLight>
              <br />
              答：可以。联机通信使用的是WG客户端，不要关闭WG就行。喵服网站只是用来管理联机房间的，你甚至可以在其他设备上访问网站来管理房间。
            </Text>
          </VStack>
        </Box>

        <Button
          alignSelf="center"
          bgColor="#b23333"
          onClick={() => {
            router.push(`/room`);
          }}
          my={3}
          mb={6}
          w="10rem"
        >
          返回联机房间
        </Button>
      </VStack>

      {showScroll && (
        <Button
          position="fixed"
          bottom="12vh"
          right="20px"
          onClick={scrollToTop}
          size="sm"
          fontSize="md"
          px={2}
          zIndex={999}
        >
          目录
        </Button>
      )}
    </Box>
  );
};

export default DocumentPage;
