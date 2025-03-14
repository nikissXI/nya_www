import type { Metadata } from "next";
import "./globals.css";
import Frame from "@/components/Frame";
import React from "react";
import { Box, ChakraProvider } from "@chakra-ui/react";

export const metadata: Metadata = {
  title: "喵~服远程联机平台",
  description: "全平台支持的局域网游戏联机平台",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <ChakraProvider>
          {/* 全局背景图 */}
          <Box
            zIndex={-1}
            position="fixed"
            width="100vw"
            height="100vh"
            backgroundImage="url('/images/bg.png')" // 替换为你的图片路径
            backgroundRepeat="repeat" // 背景图像可以重复
          ></Box>
          {/* 顶部背景图 */}
          <Box
            zIndex={99}
            position="fixed"
            top="-50px"
            width="100%"
            height="105px" // 设置高度，以便可以看到背景效果
            backgroundImage="url('/images/head_bg.png')" // 替换为你的图片路径
            backgroundRepeat="repeat-x" // 仅在水平方向上重复
            // display={{ md: "block", base: "none" }}
          ></Box>
          <Frame>{children}</Frame>
        </ChakraProvider>
      </body>
    </html>
  );
}
