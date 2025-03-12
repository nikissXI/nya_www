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
import { GetConfUrl } from "@/components/universal/GetConf";
import { getAuthToken } from "@/store/authKey";
import NextLink from "next/link";

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
  const { logined, confKey, getConfKey, userInfo } = useUserStateStore();
  const router = useRouter();

  useEffect(() => {
    if (logined && userInfo?.wg_data) {
      getConfKey();
    } else {
      router.push("/me");
      openToast({ content: "请登陆后再访问教程", status: "info" });
    }
  }, [logined]);

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
  const [showIOSId, setIOSId] = useState(false);
  const [showWinError, setWinError] = useState(false);

  const downloadConf = async () => {
    const resp = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/getDownloadConfkey`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );

    if (resp.ok) {
      const data = await resp.json();
      if (data.code === 0) {
        // 用拿到的data.key下载conf
        window.open(
          `${process.env.NEXT_PUBLIC_API_URL}/downloadConf2?key=${data.key}`,
          "_blank"
        );
      } else {
        openToast({ content: data.msg, status: "warning" });
      }
    } else if (resp.status === 401) {
      openToast({ content: "登陆凭证无效", status: "warning" });
    } else {
      openToast({ content: "服务异常，请联系服主处理", status: "error" });
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
  //////////////////////
  //////////////////////

  return (
    <Box px={5}>
      <VStack spacing={5} align="stretch">
        <Box>
          <Heading size="md" pb={2} color="#00ff17">
            目录（点击可跳转）
          </Heading>
          <VStack spacing={2} align="start" color="#7dfffe">
            <ScrollLinkM to="preface">0. 前言</ScrollLinkM>
            <ScrollLinkM to="introduction">1. 喵服的联机原理</ScrollLinkM>
            <ScrollLinkM to="words">2. 联机常用词</ScrollLinkM>
            <ScrollLinkM to="download">3. WG下载和隧道导入</ScrollLinkM>
            <ScrollLinkM to="play">4. 开始联机</ScrollLinkM>
            <ScrollLinkM to="issues">5. 常见问题</ScrollLinkM>
          </VStack>
        </Box>

        <Divider />

        <Box id="preface">
          <Heading size="md" pb={2} color="#00ff17">
            0. 前言
          </Heading>

          <Text>
            &emsp;&emsp;喵服是
            <HighLight>免费</HighLight>
            提供组网服务的服务器，既然使用别人的东西，那就花点耐心去学习。考虑到很多未曾接触过此类软件的用户，文档会尽量写的详细，字会有点多，
            <HighLight>
              用过有经验的几分钟学会，纯小白大概15分钟左右，按顺序从上往下阅读，简简单单的。
            </HighLight>
          </Text>
          <Text>
            &emsp;&emsp;如果认真阅读本文档后，仍有使用问题，联系服主QQ：1299577815。
          </Text>
        </Box>

        <Box id="introduction">
          <Heading size="md" pb={2} color="#00ff17">
            1. 喵服的联机原理
          </Heading>

          <Text>
            &emsp;&emsp;喵服实际是一个WireGuard（简称WG）服务器，WG是个异地组网软件，用于构建虚拟局域网，
            <HighLight>
              可以简单理解为“连上同一个WiFi”，实现异地联机。
            </HighLight>
          </Text>
          <Text>
            &emsp;&emsp;<HighLight>联机的玩家都要注册并连上喵服</HighLight>
            ，安卓、苹果、电脑都能接入喵服，但能不能跨平台联机得看游戏是否支持，本文档《4.开始联机》部分有详细说明。
          </Text>
        </Box>

        <Box id="words">
          <Heading size="md" pb={2} color="#00ff17">
            2. 联机常用词
          </Heading>
          <Text>
            &emsp;&emsp;眼熟一些常用的词，防止请教别人联机问题的时候，看不懂别人在问什么，也便于你学习本文档。如有其他希望补充的请联系服主。
          </Text>
          <Text>
            <HighLight>连上喵服/在线</HighLight>
            ：WG隧道打开，并且网页显示你是在线的。
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
            <HighLight>编号</HighLight>
            ：指喵服的联机编号，在我的信息界面可以查看。
          </Text>
          <Text>
            <HighLight>IP</HighLight>
            ：指喵服的联机IP，在我的信息界面可以查看，联机的时候都是使用这个IP。
          </Text>
          <Text>
            <HighLight>隧道</HighLight>
            ：连接喵服的WG配置文件，隧道名称一般为联机编号。
          </Text>
          <Text>
            <HighLight>联机房间</HighLight>
            ：默认指喵服的联机房间，不是游戏里的。
          </Text>
          <Text>
            <HighLight>防火墙</HighLight>
            ：Windows系统才有的东西，电脑联机失败可以试试把它关了。
          </Text>
        </Box>

        <Box id="download">
          <Heading size="md" pb={2} color="#00ff17">
            3. WG下载和隧道导入
          </Heading>

          <Text>
            <HighLight>&emsp;&emsp;每个账号有对应联机编号和隧道</HighLight>
            ，你要导入的隧道名称为
            {userInfo?.wg_data?.wgnum}，导入后留意隧道名称是否一致。
          </Text>

          <Tabs variant="line" colorScheme="orange" bg="#2f855a2b">
            <Text pt={2} fontWeight="bolder" ml="1rem">
              选择你要安装WG的系统类型
            </Text>
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
              <TabPanel px={0} pb={1} pt={2}>
                <VStack spacing={2} align="stretch">
                  <Box>
                    <Flex alignItems="center">
                      <Text>安装WG客户端</Text>
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

                    <Flex alignItems="center">
                      <HighLight>下载不了？</HighLight>

                      <Text
                        as="span"
                        color="#7dfffe"
                        onClick={() => {
                          setAndroidDLWarning(!showAndroidDLWarning);
                        }}
                      >
                        点我查看原因
                      </Text>
                    </Flex>

                    <Collapse in={showAndroidDLWarning}>
                      <Text fontSize="sm">
                        &emsp;到浏览器打开网站再下载，无法下载的都是因为在QQ、微信这些非浏览器应用中下载。
                      </Text>
                    </Collapse>
                  </Box>

                  <Box>
                    <Text>复制黄字，这是conf key</Text>
                    <Text
                      fontSize="sm"
                      color="#ffd648"
                      onClick={() => {
                        if (confKey) handleCopyLink(confKey);
                      }}
                      pb={1}
                    >
                      {confKey}
                    </Text>
                  </Box>

                  <Text>
                    打开WG，点右下角加号，选“通过conf_key导入”，粘贴黄字完成隧道导入。
                    <br />
                    如果提示key无效，
                    <Text
                      as="span"
                      color="#7dfffe"
                      onClick={() => {
                        getConfKey();
                      }}
                    >
                      点我刷新key
                    </Text>
                  </Text>

                  <Flex alignItems="center">
                    <Text>打开隧道开关</Text>
                    <Image
                      mx={1}
                      maxH="1.5rem"
                      src="/images/wg/android_switch.jpg"
                      alt="android_switch"
                    />
                    <Text>连上喵服</Text>
                  </Flex>

                  <Flex alignItems="center">
                    <HighLight>小米/红米设备注意事项</HighLight>
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

              <TabPanel px={0} pb={1} pt={2}>
                <VStack spacing={2} align="stretch">
                  <Box>
                    下载隧道文件，两个通道下载的东西一样，1不行就2。
                    <HighLight>
                      使用Safari浏览器访问网站再下载，其他浏览器可能无法正常下载。
                    </HighLight>
                    <Flex alignItems="center">
                      <Button
                        size="sm"
                        onClick={() =>
                          GetConfUrl(userInfo?.wg_data?.wgnum as number)
                        }
                        isDisabled={logined ? false : true}
                      >
                        下载通道1
                      </Button>

                      <Button
                        ml={5}
                        size="sm"
                        onClick={downloadConf}
                        isDisabled={logined ? false : true}
                      >
                        下载通道2
                      </Button>
                    </Flex>
                  </Box>

                  <Box>
                    安装WG客户端，
                    <HighLight>AppStore要登陆海外账号才能搜到</HighLight>，
                    <Text
                      as="span"
                      color="#7dfffe"
                      onClick={() => {
                        setIOSId(!showIOSId);
                      }}
                    >
                      没有海外账号点我
                    </Text>
                    <Collapse in={showIOSId}>
                      <Text as="span" fontSize="sm">
                        &emsp;如果没有海外账号或不知道这是什么，可以付2元找服主借QQ：1299577815
                      </Text>
                    </Collapse>
                    <Image
                      src="/images/wg/app_store.jpg"
                      alt="app_store"
                      borderRadius="md"
                      w="100%"
                      maxW="300px"
                    />
                  </Box>

                  <Text>
                    打开WG，点右上角加号，选“导入配置或压缩包”，在最近项目里选刚下载的隧道文件，完成隧道导入。
                  </Text>

                  <Box>
                    <Flex alignItems="center">
                      <Text>打开隧道开关</Text>
                      <Image
                        mx={1}
                        maxH="1.5rem"
                        src="/images/wg/iOS_switch.jpg"
                        alt="iOS_switch"
                      />
                      <Text>连上喵服。</Text>
                    </Flex>
                    <Text>出现DBS解析失败是因为没给WG访问网络的权限。</Text>
                  </Box>
                </VStack>
              </TabPanel>

              <TabPanel px={0} pb={1} pt={2}>
                <Box>
                  下载隧道文件，两个通道下载的东西一样，1不行就2。
                  <Flex alignItems="center">
                    <Button
                      size="sm"
                      onClick={() =>
                        GetConfUrl(userInfo?.wg_data?.wgnum as number)
                      }
                      isDisabled={logined ? false : true}
                    >
                      下载通道1
                    </Button>

                    <Button
                      ml={5}
                      size="sm"
                      onClick={downloadConf}
                      isDisabled={logined ? false : true}
                    >
                      下载通道2
                    </Button>
                  </Flex>
                </Box>

                <Tabs variant="line" colorScheme="orange" bg="#2f855a2b">
                  <Text pt={2} fontWeight="bolder" fontSize="sm">
                    WG客户端有msi和exe两种安装包，二选一，
                    <HighLight>优先选择msi</HighLight>
                    ，除非你电脑无法安装msi或软件无法正常工作。
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
                        <Text>下载msi安装包</Text>
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

                      <Text>双击运行安装后，跟着下图操作完成隧道导入</Text>
                      <Image
                        src="/images/wg/win_msi.jpg"
                        alt="win_msi"
                        borderRadius="md"
                        w="100%"
                        maxW="500px"
                      />
                      <Text>默认没有桌面快捷方式，要去系统开始菜单里找。</Text>
                      <Text>
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
                            点我下载bat
                          </Text>
                          ，然后右键“以管理员身份运行”修复，这通常是因为安装过vm虚拟机导致的。
                          <br />
                          &emsp;如果是其他错误或运行bat后仍然连接报错，就尝试安装exe。
                        </Text>
                      </Collapse>
                    </TabPanel>

                    <TabPanel px={0} pb={0} pt={1}>
                      <Flex alignItems="center">
                        <Text>下载exe安装包</Text>
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

                      <Text>双击运行安装后，跟着下图操作完成隧道导入</Text>
                      <Image
                        src="/images/wg/win_exe.jpg"
                        alt="win_exe"
                        borderRadius="md"
                        w="100%"
                        maxW="500px"
                      />
                      <Text>如果连接还是报错那就找服主看看吧。</Text>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </TabPanel>

              <TabPanel px={0} pb={1} pt={2}>
                <VStack spacing={2} align="stretch">
                  <Box>
                    下载隧道文件，两个通道下载的东西一样，1不行就2。
                    <Flex alignItems="center">
                      <Button
                        size="sm"
                        onClick={() => {
                          const isSafari =
                            navigator.userAgent.includes("Safari");
                          if (isSafari) {
                            GetConfUrl(userInfo?.wg_data?.wgnum as number);
                          } else {
                            openToast({
                              content: "请在Safari中打开网站下载",
                              status: "warning",
                            });
                          }
                        }}
                        isDisabled={logined ? false : true}
                      >
                        下载通道1
                      </Button>

                      <Button
                        ml={5}
                        size="sm"
                        onClick={() => {
                          const isSafari =
                            navigator.userAgent.includes("Safari");
                          if (isSafari) {
                            downloadConf();
                          } else {
                            openToast({
                              content: "请在Safari中打开网站下载",
                              status: "warning",
                            });
                          }
                        }}
                        isDisabled={logined ? false : true}
                      >
                        下载通道2
                      </Button>
                    </Flex>
                  </Box>

                  <Box>
                    安装WG客户端，
                    <HighLight>AppStore要登陆海外账号才能搜到</HighLight>，
                    <Text
                      as="span"
                      color="#7dfffe"
                      onClick={() => {
                        setIOSId(!showIOSId);
                      }}
                    >
                      没有海外账号点我
                    </Text>
                    <Collapse in={showIOSId}>
                      <Text as="span" fontSize="sm">
                        &emsp;如果没有海外账号或不知道这是什么，可以付2元找服主借QQ：1299577815
                      </Text>
                    </Collapse>
                    <Image
                      src="/images/wg/app_store_mac.jpg"
                      alt="app_store_mac"
                      borderRadius="md"
                      w="100%"
                      maxW="300px"
                    />
                  </Box>

                  <Text>运行WG，跟着下图操作完成隧道导入</Text>
                  <Image
                    src="/images/wg/mac.jpg"
                    alt="mac"
                    borderRadius="md"
                    w="100%"
                    maxW="500px"
                  />
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>

        <Box id="play">
          <Heading size="md" pb={2} color="#00ff17">
            4. 开始联机
          </Heading>
          <Text>联机房间页面功能介绍看图</Text>
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
          <Text>
            &emsp;&emsp;在一个联机房间里，谁都可以在创建多人游戏（作为主机），其他人加入游戏即可（作为客机）。
          </Text>
          <Text>
            &emsp;&emsp;
            <HighLight>
              支持填IP加入的游戏都支持使用喵服联机，局域网搜索加入的就不一定了。
            </HighLight>
            下方有目前已收录的游戏，在列表中的游戏就是明确支持联机的，游戏名旁边的括号表示支持什么系统平台，点击游戏名查看具体的联机操作指导，如果没有就自己尝试或咨询服主。
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
            5. 常见问题
          </Heading>

          <VStack spacing={2} align="stretch">
            <Text>
              <HighLight>问：国外能使用吗？校园网能使用吗</HighLight>
              <br />
              答：仅支持国内（不包括港澳台）使用，在国外即使能连上也不能保障连接稳定性，能连只能说算你好运。至于校园网得看学校，有的可以有的不可以，你换流量试试不就知道了。
            </Text>

            <Text>
              <HighLight>问：不同平台的游戏能不能一起联机？</HighLight>
              <br />
              答：前面已经说了，能不能跨平台联机取决于游戏支不支持，具体看上面的游戏教程列表。
            </Text>

            <Text>
              <HighLight>问：联机失败怎么办？</HighLight>
              <br />
              答：检查是否都连上了喵服处于在线状态，以及处在同一个联机房间里。对于手机或平板，客机加入游戏的时候，主机必须要在游戏里，游戏放后台客机就无法加入了。如果认为自己的操作没有任何问题仍然无法联机，那就去问服主。
            </Text>

            <Text>
              <HighLight>问：浏览器（喵服网站）可以关闭吗？</HighLight>
              <br />
              答：可以的。联机通信使用的是WG客户端，不要关闭它就行。喵服网站只是用来管理联机房间的，你甚至可以在其他设备上访问网站来管理房间。
            </Text>

            <Text>
              <HighLight>
                问：我WG隧道打开了还是连不上，显示离线怎么办？
              </HighLight>
              <br />
              答：首先到喵服网站-我的信息页面，核对你的联机编号和WG里的隧道名称是否一致。如果不一致请导入正确的隧道再试，如果一致就换一个浏览器或网络环境再试。
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
