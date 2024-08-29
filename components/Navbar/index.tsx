"use client";

import NextLink from "next/link";
import {
  Box,
  Flex,
  Text,
  Link,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  Center,
  DrawerOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import { LoginStateText } from "./LoginState";

const Navbar = ({ path }: { path: string }) => {
  const rootPath = "/" + path.split("/")[1];
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [title, setTitle] = useState<string>("");

  useEffect(() => {
    const gameTitles: { [key: string]: string } = {
      "/nya/android": "喵服安卓教程",
      "/nya/ios": "喵服苹果教程",
      "/nya/pc": "喵服电脑教程",
      theEscapists: "联机教程 - 逃脱者：困境突围",
      juicyRealm: "联机教程 - 恶果之地",
      wizardOfLegend: "联机教程 - 传说法师",
      aresVirus2: "联机教程 - 阿瑞斯病毒2",
      stardewValley: "联机教程 - 星露谷物语",
      soulKnight: "联机教程 - 元气骑士",
      otherworldLegends: "联机教程 - 战魂铭人",
      minecraft: "联机教程 - 我的世界",
      terraria: "联机教程 - 泰拉瑞亚",
    };

    const titles: { [key: string]: string } = {
      "/": "首页",
      "/wgnum": "编号绑定",
      "/wgnum/bind": "身份验证",
      "/wgnum/query": "绑定查询",
      "/sponsor": "赞助榜",
      "/tutorial": "联机教程",
    };

    const matchedTitle = Object.keys(gameTitles).find((key) =>
      path.includes(key)
    );
    setTitle(matchedTitle ? gameTitles[matchedTitle] : titles[path]);
  }, [path]);

  const rootGuide = [
    { name: "首页", path: "/" },
    { name: "编号绑定", path: "/wgnum" },
    { name: "联机教程", path: "/tutorial" },
    { name: "赞助榜", path: "/sponsor" },
  ];

  return (
    <Box>
      <Center
        width="100%"
        color="white"
        fontSize="xl"
        fontWeight="bold"
        position="fixed"
        mt={{ base: 4, md: 3 }}
        display="flex"
      >
        {title}
      </Center>

      {/* 桌面端菜单，移动端时不展示（即none） */}
      <Flex
        display={{ base: "none", md: "flex" }}
        justifyContent="space-between"
        direction="column"
        pt={12}
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
          {/* 登陆状态 */}
          <LoginStateText />
        </Flex>
      </Flex>

      {/* 移动端菜单按钮，桌面端时不展示（即none） */}

      <Button
        position="fixed"
        display={{ base: "flex", md: "none" }}
        top={3}
        right={3}
        variant="outline"
        colorScheme="whiteAlpha"
        rounded={10}
        onClick={onOpen}
        border={0}
      >
        <HamburgerIcon color="white" boxSize={6} />
      </Button>

      {/* 移动端抽屉菜单 */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent maxWidth="75%" bg="#23314be3">
          <DrawerHeader color="white" textAlign="center" bg="#254c7a">
            网站导航
          </DrawerHeader>

          <DrawerBody>
            <Flex as="nav" direction="column" p={4}>
              {rootGuide.map((item) => (
                <Link
                  as={NextLink}
                  key={item.path}
                  href={item.path}
                  mx={6}
                  my={3}
                  py={2}
                  _hover={{ textDecoration: "none" }}
                  bg={path === item.path ? "#4098f282" : "transparent"}
                  rounded={12}
                  onClick={onClose}
                >
                  <Center>
                    <Text
                      color={path === item.path ? "white" : "white"}
                      fontWeight={path === item.path ? "bold" : "normal"}
                    >
                      {item.name}
                    </Text>
                  </Center>
                </Link>
              ))}
              {/* 登陆状态 */}
              <LoginStateText />
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};
export default Navbar;
