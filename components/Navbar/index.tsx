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

const Navbar = ({ path }: { path: string }) => {
  const rootPath = "/" + path.split("/")[1];
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [title, setTitle] = useState<string>("");
  useEffect(() => {
    // 根据路由设置标题
    const titles: { [key: string]: string } = {
      "/": "首页",
      "/wgnum": "编号绑定",
      "/wgnum/bind": "身份验证",
      "/wgnum/query": "绑定查询",
      "/tutorial": "联机教程",
      "/tutorial/android": "安卓教程",
      "/tutorial/ios": "苹果教程",
      "/tutorial/pc": "电脑教程",
      "/sponsor": "赞助榜",
    };
    if (path.includes("/tutorial/android")) {
      setTitle(titles["/tutorial/android"]);
    } else if (path.includes("/tutorial/ios")) {
      setTitle(titles["/tutorial/ios"]);
    } else if (path.includes("/tutorial/pcios")) {
      setTitle(titles["/tutorial/pc"]);
    } else {
      setTitle(titles[path]);
    }
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
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};
export default Navbar;
