import type { Metadata } from "next";

import { Box, ChakraProvider } from "@chakra-ui/react";
import Frame from "@/components/Frame";

import "./globals.css";

export const metadata: Metadata = {
  title: "喵~服远程联机平台",
  description: "全平台局域网游戏联机平台",
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
            as="section"
            position="fixed"
            inset={0}
            zIndex={-1}
            backgroundImage="url('/images/bg.png')"
            backgroundRepeat="repeat"
            backgroundSize="auto"
          />
          {/* 顶部背景图 */}
          <Box
            as="header"
            position="fixed"
            top={-50}
            left={0}
            width="100%"
            height="105px"
            zIndex={99}
            backgroundImage="url('/images/head_bg.png')"
            backgroundRepeat="repeat-x"
            backgroundSize="auto"
          />
          <Frame>{children}</Frame>
        </ChakraProvider>
      </body>
    </html>
  );
}
