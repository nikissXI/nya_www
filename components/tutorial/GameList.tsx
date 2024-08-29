"use client";

import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Input,
  List,
  Text,
  ListItem,
  Box,
  Link,
} from "@chakra-ui/react";
import NextLink from "next/link";

interface Article {
  path: string;
  title: string;
}

const articles: Article[] = [
  { path: "/tutorial/theEscapists", title: "逃脱者2" },
  { path: "/tutorial/juicyRealm/1", title: "恶果之地" },
  { path: "/tutorial/aresVirus2/1", title: "阿瑞斯病毒2" },
  { path: "/tutorial/stardewValley/1", title: "星露谷物语" },
  { path: "/tutorial/wizardOfLegend/1", title: "传说法师" },
  { path: "/tutorial/soulKnight/1", title: "元气骑士" },
  { path: "/tutorial/otherworldLegends/1", title: "战魂铭人" },
  { path: "/tutorial/minecraft/1", title: "我的世界" },
  { path: "/tutorial/terraria/1", title: "泰拉瑞亚" },
];

export const GameListModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bgColor="#002f5c">
        <ModalHeader textAlign="center">游戏教程列表</ModalHeader>
        <ModalCloseButton />
        <Text textAlign="center" color="#ffc500" mx={6}>
          提示1：先学会连接喵服再看这里
          <br />
          提示2：不仅限于支持列表中的游戏联机
        </Text>
        <ModalBody mx={6} mb={5}>
          <Input
            placeholder="输入关键字搜索"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            mb={4}
          />
          <Box maxHeight="360px" overflowY="auto">
            <List spacing={3}>
              {filteredArticles.map((article) => (
                <ListItem key={article.path}>
                  <Link
                    as={NextLink}
                    href={article.path}
                    color="#a6d4ff"
                    _hover={{ textDecoration: "none" }}
                    onClick={onClose}
                  >
                    {article.title}
                  </Link>
                </ListItem>
              ))}
            </List>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
