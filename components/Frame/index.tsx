import {
  Box,
  Center,
  Flex,
  Heading,
  Spinner,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../Nav/Navbar";
import SideBar from "../Nav/SideBar";
import Toaster from "../universal/Toaster";
import { useUserStateStore } from "@/store/user-state";
import LoginModal from "../universal/Login";
import { NoticeText } from "../universal/Notice";
import TunnelUpdateModal from "../docs/ReGetIpModal";
import ServerNodeListModal from "../serverInfo/nodeList";
import { ROOM_GAME_LIST } from "@/utils/roomGames";

/**
 * 应用外壳
 * ------------------------------------------------------------------
 * 结构：顶部导航（sticky） → 内容区（标题 + 页面） + 右侧信息栏 → 移动端底部标签栏
 * - 桌面端：内容与侧栏左右分栏（1200px 居中）
 * - 移动端：侧栏顺流排在内容下方，底部固定标签栏，主内容预留出底部安全间距
 * - embed 模式（被外部页面内嵌）：整块导航与侧栏都不渲染，只留内容
 */

// 页面标题配置：新增页面时在这里补一行
// 注意 /docs 本身是 WG 安装教程，/docs/<游戏> 才是各游戏的联机教程（见下面的 DOC_GAME_TITLE）
const PAGE_TITLES: Record<string, string> = {
  "/": "喵服首页",
  "/register": "注册账号",
  "/forgetPass": "忘记密码",
  "/me": "账号信息",
  "/sponsor": "赞助喵服",
  "/docs": "WG安装教程",
  "/room": "联机房间",
  "/login": "登录",
  "/offlineCheck": "WG连接失败或掉线排查",
};

/** /docs/<游戏> 这类子页的标题后缀（各游戏的联机教程） */
const DOC_GAME_TITLE = "联机教程";

/**
 * /docs/<游戏> 的完整页面标题
 * ------------------------------------------------------------
 * 游戏名直接复用房间页的同一份数据（utils/roomGames.ts），避免两处维护；
 * 「通用联机房」不是具体游戏，标题在这里单独覆盖
 */
const DOC_PAGE_TITLE_OVERRIDES: Record<string, string> = {
  "/docs/universal": "通用联机教程",
};

const DOC_PAGE_TITLES: Record<string, string> = {
  ...Object.fromEntries(
    ROOM_GAME_LIST.map((game) => [
      game.path,
      `${game.title} ${DOC_GAME_TITLE}`,
    ]),
  ),
  ...DOC_PAGE_TITLE_OVERRIDES,
};

/** 顶部氛围光：纯 CSS 渐变替代原来的背景图 */
const GLOW_LIGHT =
  "radial-gradient(1200px 420px at 50% -140px, rgba(59, 130, 246, 0.16), rgba(59, 130, 246, 0) 70%)";
const GLOW_DARK =
  "radial-gradient(1200px 420px at 50% -140px, rgba(59, 130, 246, 0.22), rgba(8, 13, 24, 0) 70%)";

export default function Frame({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { pathname } = useLocation();
  const glow = useColorModeValue(GLOW_LIGHT, GLOW_DARK);

  const loginLoading = useUserStateStore((state) => state.loginLoading);
  const getUserInfo = useUserStateStore((state) => state.getUserInfo);
  const getInviteCode = useUserStateStore((state) => state.getInviteCode);
  const getEmbedParama = useUserStateStore((state) => state.getEmbedParama);
  const getAnnouncementsData = useUserStateStore(
    (state) => state.getAnnouncementsData,
  );
  const announcementsData = useUserStateStore(
    (state) => state.announcementsData,
  );
  const embed = useUserStateStore((state) => state.embed);

  // 启动时拉取登录态 + 邀请码 + embed 参数 + 公告
  // （公告原来挂在 Navbar 上，embed 模式下不会执行，挪到这里保证内嵌页也有公告）
  useEffect(() => {
    getUserInfo();
    getInviteCode();
    getEmbedParama();
  }, [getUserInfo, getInviteCode, getEmbedParama]);

  useEffect(() => {
    if (announcementsData === undefined) getAnnouncementsData();
  }, [announcementsData, getAnnouncementsData]);

  const segments = pathname.split("/").filter(Boolean);
  const rootPath = "/" + (segments[0] ?? "");
  // /docs 是 WG 安装教程，/docs/<游戏> 是各游戏的联机教程（标题带上游戏名，便于分辨）
  const title =
    rootPath === "/docs" && segments.length > 1
      ? (DOC_PAGE_TITLES["/" + segments.join("/")] ?? DOC_GAME_TITLE)
      : (PAGE_TITLES[rootPath] ?? "");
  const showPageTitle =
    Boolean(title) &&
    rootPath !== "/" &&
    rootPath !== "/sponsor" &&
    rootPath !== "/room";

  // 浏览器标签页标题跟着路由走（首页不重复拼站点名）
  useEffect(() => {
    document.title = showPageTitle ? `${title} · 喵服联机平台` : "喵服联机平台";
  }, [showPageTitle, title]);

  return (
    <>
      <Toaster />
      <LoginModal />
      <TunnelUpdateModal />
      <ServerNodeListModal />

      <Box minH="100dvh" bg="bg.page" position="relative">
        {!embed && (
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            h="520px"
            bgImage={glow}
            pointerEvents="none"
            aria-hidden
          />
        )}

        {!embed && <Navbar path={pathname} />}

        <Box
          as="main"
          position="relative"
          maxW="1200px"
          mx="auto"
          px={{ base: 4, md: 6 }}
          pt={{ base: 5, md: 8 }}
          // 移动端给底部标签栏留出空间
          pb={embed ? 6 : { base: "88px", md: 12 }}
        >
          <Flex
            direction={{ base: "column", lg: "row" }}
            align="flex-start"
            gap={{ base: 0, lg: 8 }}
          >
            <Box flex="1" minW={0} w="100%">
              {showPageTitle && !embed && (
                <Heading
                  as="h1"
                  fontSize={{ base: "2xl", md: "3xl" }}
                  fontWeight="800"
                  mb={{ base: 4, md: 6 }}
                  textAlign="center"
                >
                  {title}
                </Heading>
              )}

              {loginLoading ? (
                <Box>
                  {!embed && <NoticeText />}

                  <Center mt={6}>
                    <VStack spacing={3}>
                      <Spinner
                        thickness="3px"
                        speed="0.65s"
                        emptyColor="border.line"
                        color="brand.solid"
                        size="lg"
                      />
                      <Text fontSize="sm" color="text.faint">
                        正在获取账号信息…
                      </Text>
                    </VStack>
                  </Center>
                </Box>
              ) : (
                children
              )}
            </Box>

            {!embed && <SideBar />}
          </Flex>
        </Box>
      </Box>
    </>
  );
}
