"use client";

import NextLink from "next/link";
import { Box, Flex, Text, Link, Center } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export function Header({ path }: { path: string }) {
  const rootPath = "/" + path.split("/")[1];

  const [title, setTitle] = useState<string>("");

  useEffect(() => {
    const gameTitles: { [key: string]: string } = {
      "/room/": "联机房间",
      "/nya/android": "WG部署教程-安卓",
      "/nya/ios": "WG部署教程-苹果",
      "/nya/pc": "WG部署教程-电脑",
      theEscapists: "逃脱者：困境突围",
      juicyRealm: "恶果之地",
      wizardOfLegend: "传说法师",
      aresVirus2: "阿瑞斯病毒2",
      stardewValley: "星露谷物语",
      soulKnight: "元气骑士",
      otherworldLegends: "战魂铭人",
      minecraft: "我的世界",
      terraria: "泰拉瑞亚",
      l4d2: "求生之路2",
    };

    const titles: { [key: string]: string } = {
      "/": "首页",
      "/register": "注册",
      "/forgetPass": "忘记密码",
      "/me": "我的信息",
      "/sponsor": "赞助喵服",
      "/tutorial": "WG部署教程",
      "/room": "联机房间",
    };

    const matchedTitle = Object.keys(gameTitles).find((key) =>
      path.includes(key)
    );
    setTitle(matchedTitle ? gameTitles[matchedTitle] : titles[path]);
  }, [path]);

  const rootGuide = [
    { name: "首页", path: "/" },
    { name: "联机房间", path: "/room" },
    { name: "我的信息", path: "/me" },
    // { name: "赞助榜", path: "/sponsor" },
  ];

  return (
    <Box as="header" minW="200px" flex={{ base: "none", md: "1" }}>
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
        <Flex as="nav" direction="column" py={10} px={12}>
          {rootGuide.map((item) => (
            <Link
              as={NextLink}
              key={item.path}
              href={item.path}
              my={3}
              py={2}
              _hover={{ textDecoration: "none" }}
              bg={rootPath === item.path ? "#4098f282" : "transparent"}
              rounded={12}
            >
              <Center>
                <Text
                  color={rootPath === item.path ? "white" : "gray.200"}
                  fontWeight={rootPath === item.path ? "bold" : "normal"}
                >
                  {item.name}
                </Text>
              </Center>
            </Link>
          ))}
        </Flex>
      </Flex>
    </Box>
  );
}
