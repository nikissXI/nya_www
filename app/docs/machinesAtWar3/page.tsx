"use client";
import { Text, Divider, List, ListItem, ListIcon } from "@chakra-ui/react";
import { Button } from "@/components/universal/button";
import { MdTipsAndUpdates } from "react-icons/md";
import DocFlex from "@/components/docs/DocFlex";
import BackButton from "@/components/docs/BackButton";

export default function Page() {
  const TextList = [
    "喵服关联QQ群：689358384",
    "电脑端不支持与移动端联机，安卓也不能跟苹果联机",
    "玩家都处于同个联机房间并在线后，主机点击“创建服务器”，创建完成后在游戏里等待",
    "客机点击“加入服务器”，即可看到主机所创服务器，选中后点击加入即可",
  ];

  return (
    <DocFlex>
      <List spacing={2}>
        {TextList.map((reason, index) => (
          <ListItem key={index} textAlign="left">
            <ListIcon as={MdTipsAndUpdates} />
            {reason}
          </ListItem>
        ))}
      </List>

      <Divider my={5} />

      <BackButton />
    </DocFlex>
  );
}
