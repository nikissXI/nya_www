"use client";

import { Text, Box } from "@chakra-ui/react";
import { WarningIcon } from "@chakra-ui/icons";

const tips = [
  "玩家都要连上WG并在线，处于同一个联机房间才能联机，只有一个人连上无法联机",
  "使用校园网、公司网如果连上WG还是离线，换个网络再试；不支持国外使用，就算连上也不稳定",
  "网页（浏览器）只是用于管理联机房间，关闭不影响联机",
  "WG是用于联机的，不能关掉，安卓手机建议锁定程序防止杀后台",
  "移动设备联机，在其他玩家加入时，游戏不能后台，否则无法加入",
  "Windows联机，如果联机失败，检查防火墙是否放通游戏（不会就把防火墙关了试试）",
  "编号如果长时间没联机被回收，获取个新的就行，WG的隧道文件也要导入新的",
  "跟着教程操作后仍无法解决问题，就找服主QQ:1299577815，不看完就来打扰等骂",
];

export function WarningText() {
  return (
    <Box>
      {tips.map((tip, index) => (
        <Text fontSize="sm" key={index} my={1}>
          <WarningIcon mr={2} />
          {tip}
        </Text>
      ))}
    </Box>
  );
}
