import React from "react";
import { Box } from "@chakra-ui/react";
import { DocNotice } from "./DocParts";

/**
 * 联机教程页的统一容器
 * ------------------------------------------------------------------
 * 顶部固定一段「开始前请注意」（与 WG 安装教程共用 DocNotice），下面放各游戏文档正文。
 * 页面左右留白由 Frame 统一提供，这里不再重复加 padding。
 */

const defaultNotices = [
  "开始联机前请确保玩家在同一个喵服联机房间并都在线",
  "主机：指联机模式中创建多人游戏的设备",
  "客机：指联机模式中加入多人游戏的设备",
];

export default function DocBox({
  children,
  notices = [],
}: {
  children: React.ReactNode;
  notices?: string[];
}) {
  return (
    <Box maxW="900px" mx="auto" pb={5}>
      <DocNotice notices={[...defaultNotices, ...notices]} />

      {children}
    </Box>
  );
}
