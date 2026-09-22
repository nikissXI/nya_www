// import { gotoServerEditor, Inspector } from "react-dev-inspector";
import { Center, Spinner } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import { Box, Flex } from "@chakra-ui/react";
import Navbar from "../Nav/Navbar";
import SideBar from "../Nav/SideBar";
import Toaster from "../universal/Toaster";
import { useUserStateStore } from "@/store/user-state";
import LoginModal from "../universal/Login";
import { NoticeText } from "../universal/Notice";
import TunnelUpdateModal from "../docs/ReGetIpModal";
import ServerNodeListModal from "../serverInfo/nodeList";
import { useEffect } from "react";

// 页面标题配置：新增页面时在这里补一行
const PAGE_TITLES: Record<string, string> = {
  "/": "喵服首页",
  "/register": "注册账号",
  "/forgetPass": "忘记密码",
  "/me": "我的信息",
  "/sponsor": "赞助喵服",
  "/docs": "联机教程",
  "/room": "联机房间",
};

export default function Frame({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { pathname } = useLocation();
  const loginLoading = useUserStateStore((state) => state.loginLoading);
  const getInviteCode = useUserStateStore((state) => state.getInviteCode);
  const getInApp = useUserStateStore((state) => state.getInApp);
  const inApp = useUserStateStore((state) => state.inApp);

  // 登录加载完成后获取邀请码
  useEffect(() => {
    getInviteCode();
    getInApp();
  }, [getInviteCode, getInApp]);

  const rootPath = "/" + pathname.split("/")[1];
  const title = PAGE_TITLES[rootPath] ?? "";

  return (
    <>
      <Toaster />
      <LoginModal />
      <TunnelUpdateModal />
      <ServerNodeListModal />

      <Box
        position="fixed"
        inset={0}
        zIndex={-1}
        backgroundImage="url('/images/bg.png')"
        backgroundRepeat="repeat"
        backgroundSize="auto"
      />

      <Flex
        position="relative"
        direction={{ base: "column", md: "row" }} // 移动端竖向，桌面端横向
      >
        {!inApp && (
          <>
            {/* 标题 */}
            <Center
              width="100%"
              color="white"
              fontSize="xl"
              fontWeight="bold"
              position="fixed"
              mt={2.5}
              display="flex"
              zIndex={100}
            >
              {title}
            </Center>

            {/* 标题栏图片 */}
            <Box
              as="header"
              position="fixed"
              top={-50}
              left={0}
              width="100%"
              height="105px"
              zIndex={99}
              backgroundImage="url('/images/head_bg.webp')"
              backgroundRepeat="repeat-x"
              backgroundSize="auto"
            />

            {/* 导航栏 */}
            <Navbar path={pathname} />
          </>
        )}

        {/* 主内容区域 */}
        <Box as="main" flex={{ base: "1", md: "4" }} mt={{ base: 20, md: 100 }}>
          {loginLoading ? (
            <Box>
              <NoticeText />

              <Center mt={5}>
                <Spinner size="lg" />
              </Center>
            </Box>
          ) : (
            children
          )}
        </Box>

        {/* 侧边栏 */}
        {!inApp && <SideBar />}
      </Flex>
    </>
  );
}
