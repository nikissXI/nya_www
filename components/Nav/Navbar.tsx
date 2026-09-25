import { Avatar, Box, Button, Flex, HStack, Icon, Image, Text, useColorModeValue } from "@chakra-ui/react";
import { useEffect } from "react";
import { FaDownload, FaHeart, FaHome, FaUser, FaUsers } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { useUserStateStore } from "@/store/user-state";
import ColorModeToggle from "../universal/ColorModeToggle";

/**
 * 全站顶部导航
 * ------------------------------------------------------------------
 * - 顶部栏：logo + 主导航（桌面） + 主题切换 + 用户入口
 * - 底部标签栏：移动端专用（固定在底部，含安全区）
 * 两处共用同一份 NAV_ITEMS，避免加了页面只改一边。
 */

type NavItem = {
  label: string;
  path: string;
  icon: React.ComponentType;
  /** 是否出现在移动端底部标签栏 */
  tab: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { label: "首页", path: "/", icon: FaHome, tab: true },
  { label: "房间", path: "/room", icon: FaUsers, tab: true },
  // 注意：/docs 是 WG 安装教程（各游戏联机教程在 /docs/<游戏>，没有独立入口）
  { label: "WG安装", path: "/docs", icon: FaDownload, tab: true },
  { label: "赞助", path: "/sponsor", icon: FaHeart, tab: false },
  { label: "我的", path: "/me", icon: FaUser, tab: true },
];

/** 顶部栏毛玻璃底色（半透明才能看到 blur 效果） */
const HEADER_BG_LIGHT = "rgba(255, 255, 255, 0.82)";
const HEADER_BG_DARK = "rgba(15, 23, 41, 0.82)";

export default function Navbar({ path }: { path?: string }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // 换页回到顶部（原来挂在 Navbar，保留在同一处）
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const userInfo = useUserStateStore((s) => s.userInfo);
  const openLoginModal = useUserStateStore((s) => s.openLoginModal);

  // 注意：Chakra 不支持在属性值对象里写 _dark（会被当成响应式断点），必须用 hook
  const headerBg = useColorModeValue(HEADER_BG_LIGHT, HEADER_BG_DARK);

  const currentPath = path || pathname;
  const rootPath = "/" + currentPath.split("/")[1];

  return (
    <>
      <Box
        as="header"
        position="sticky"
        top={0}
        zIndex={100}
        bg={headerBg}
        borderBottomWidth="1px"
        borderColor="border.line"
        backdropFilter="blur(12px)"
      >
        <Flex
          maxW="1200px"
          mx="auto"
          px={{ base: 4, md: 6 }}
          h={{ base: "56px", md: "64px" }}
          align="center"
          gap={3}
        >
          {/* Logo */}
          <Flex
            as="button"
            type="button"
            align="center"
            gap={2}
            onClick={() => navigate("/")}
            title="喵服联机平台"
            flexShrink={0}
          >
            <Image
              src="/images/logo.webp"
              alt="喵服"
              boxSize={{ base: "28px", md: "32px" }}
              objectFit="contain"
            />
            <Text
              display={{ base: "none", sm: "block" }}
              fontWeight="800"
              fontSize="md"
              letterSpacing="-0.01em"
              whiteSpace="nowrap"
            >
              喵服联机平台
            </Text>
          </Flex>

          {/* 桌面端主导航 */}
          <HStack
            as="nav"
            display={{ base: "none", md: "flex" }}
            spacing={1}
            ml={3}
          >
            {NAV_ITEMS.filter((item) => item.path !== "/me").map((item) => {
              const isActive = currentPath === item.path;
              return (
                <Box
                  key={item.path}
                  as="button"
                  type="button"
                  px={3}
                  py={2}
                  rounded="full"
                  fontSize="sm"
                  fontWeight="600"
                  color={isActive ? "brand.text" : "text.muted"}
                  bg={isActive ? "brand.soft" : "transparent"}
                  transition="background .2s ease, color .2s ease"
                  _hover={{
                    bg: isActive ? "brand.soft" : "bg.hover",
                    color: isActive ? "brand.text" : "text.main",
                  }}
                  onClick={() => navigate(item.path)}
                >
                  {item.label}
                </Box>
              );
            })}
          </HStack>

          <Box flex="1" />

          {/* 主题切换 */}
          <ColorModeToggle />

          {/* 用户入口：未登录给登录按钮，已登录给头像（点头像进「我的」） */}
          {userInfo ? (
            <Box
              as="button"
              type="button"
              onClick={() => navigate("/me")}
              borderRadius="full"
              title="我的信息"
              aria-label="我的信息"
              transition="box-shadow .2s ease, transform .2s ease"
              _hover={{ transform: "translateY(-1px)" }}
            >
              <Avatar
                size="sm"
                name={userInfo.username || String(userInfo.uid)}
                bg="brand.solid"
                color="text.inverted"
                fontWeight="700"
              />
            </Box>
          ) : (
            <Button
              size="sm"
              variant="solid"
              onClick={openLoginModal}
              flexShrink={0}
            >
              登录
            </Button>
          )}
        </Flex>
      </Box>

      {/* 移动端底部标签栏 */}
      <Flex
        as="nav"
        position="fixed"
        bottom={0}
        left={0}
        right={0}
        zIndex={100}
        display={{ base: "flex", md: "none" }}
        bg={headerBg}
        borderTopWidth="1px"
        borderColor="border.line"
        backdropFilter="blur(12px)"
        justify="space-around"
        pt={1.5}
        pb={1.5}
        className="safe-bottom"
      >
        {NAV_ITEMS.filter((item) => item.tab).map((item) => {
          const isActive = currentPath === item.path;
          return (
            <Flex
              key={item.path}
              as="button"
              type="button"
              direction="column"
              align="center"
              justify="center"
              gap={1}
              flex="1"
              py={1}
              color={isActive ? "brand.text" : "text.faint"}
              transition="color .2s ease"
              onClick={() => navigate(item.path)}
            >
              <Icon
                as={item.icon}
                boxSize="18px"
                transition="transform .2s ease"
                transform={isActive ? "translateY(-1px) scale(1.05)" : "none"}
              />
              <Text fontSize="10px" fontWeight="600" lineHeight="1">
                {item.label}
              </Text>
            </Flex>
          );
        })}
      </Flex>
    </>
  );
}
