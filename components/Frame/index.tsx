"use client";

import { gotoServerEditor, Inspector } from "react-dev-inspector";
import { ChakraProvider } from "@chakra-ui/react";
import { usePathname } from "next/navigation";
import { Box, Flex, Text } from "@chakra-ui/react";
import Navbar from "../Navbar";
import RelateGroupList from "../relateGroups";
const Frame = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const pathname = usePathname(); // 获取当前路径名

  return (
    <ChakraProvider>
      <Flex
        position="relative"
        direction={{ base: "column", md: "row" }} // 移动端竖向，桌面端横向
        height="100vh"
      >
        {/* 头部 */}
        <Box
          as="header"
          minW="240px"
          flex={{ base: "none", md: "1" }} // 桌面端占据 1/3 宽度
        >
          {/* 导航栏 */}
          <Navbar path={pathname}></Navbar>
        </Box>

        {/* 主内容区域 */}
        <Box
          as="main"
          flex={{ base: "1", md: "4" }} // 移动端占据全部宽度，桌面端占据 2/3 宽度
          mt={{ base: 20, md: 100 }}
          overflowX="hidden"
          minH={{ base: "520px", md: "auto" }}
        >
          {children}
        </Box>

        {/* 底部 */}
        <Box
          as="footer"
          minW="240px"
          flex={{ base: "none", md: "1" }} // 桌面端占据 1/3 宽度
          mt={{ base: "5", md: "100" }}
          pb={6}
        >
          <RelateGroupList/>
        </Box>
      </Flex>

      <Inspector
        keys={["Ctrl", "Shift", "\\"]}
        onInspectElement={({ codeInfo }) => {
          console.log(codeInfo);
          // 拼接工作目录
          if (codeInfo.absolutePath === undefined) {
            codeInfo.absolutePath = `${process.env.CWD}/${codeInfo.relativePath}`;
            delete codeInfo.relativePath;
          }
          gotoServerEditor(codeInfo);
        }}
      />
    </ChakraProvider>
  );
};
export default Frame;
