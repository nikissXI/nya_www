import { Link as RouterLink } from "react-router-dom";
import { Box, Flex, Text, Link, Center } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useUserStateStore } from "@/store/user-state";
import { useLocation } from "react-router-dom";

export function Header({ path }: { path: string }) {
  const { pathname } = useLocation();
  // 每次路由变化都滚动到顶部
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const { getServerData, serverData } = useUserStateStore();

  useEffect(() => {
    if (serverData === undefined) {
      getServerData(); // 只在数据为空时请求
    }
  }, [serverData, getServerData]);

  const rootPath = "/" + path.split("/")[1];
  const [title, setTitle] = useState<string>("");

  useEffect(() => {
    // const gameTitles: { [key: string]: string } = {
    //   "/room/": "联机房间",
    //   "/nya/android": "WG部署教程-安卓",
    //   "/nya/ios": "WG部署教程-苹果",
    //   "/nya/pc": "WG部署教程-电脑",
    // };

    const titles: { [key: string]: string } = {
      "/": "首页",
      "/register": "注册",
      "/forgetPass": "忘记密码",
      "/me": "我的信息",
      "/sponsor": "赞助喵服",
      "/docs": "喵服联机教程",
      "/room": "联机房间",
    };

    // const matchedTitle = Object.keys(gameTitles).find((key) =>
    //   path.includes(key)
    // );
    // setTitle(matchedTitle ? gameTitles[matchedTitle] : titles[path]);
    setTitle(titles[path]);
  }, [path]);

  const rootGuide = [
    { name: "首页", path: "/" },
    { name: "联机房间", path: "/room" },
    { name: "我的信息", path: "/me" },
  ];

  return (
    <Box as="header" maxW="200px" flex={{ base: "none", md: "0 0 200px" }}>
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

      {/* 桌面端菜单，移动端时不展示（即none） */}
      <Flex
        display={{ base: "none", md: "flex" }}
        justifyContent="space-between"
        direction="column"
        pt={12}
        top={0}
        position="sticky"
      >
        <Flex as="nav" direction="column" py={10} px={8}>
          {rootGuide.map((item) => (
            <Link
              as={RouterLink}
              key={item.path}
              to={item.path}
              my={3}
              py={3}
              _hover={{ textDecoration: "none" }}
              bg={rootPath === item.path ? "#4098f282" : "transparent"}
              rounded={12}
            >
              <Text
                textAlign="center"
                color={rootPath === item.path ? "white" : "gray.200"}
                fontWeight={rootPath === item.path ? "bold" : "normal"}
              >
                {item.name}
              </Text>
            </Link>
          ))}
        </Flex>
      </Flex>
    </Box>
  );
}
