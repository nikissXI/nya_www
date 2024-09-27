"use client";

import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  VStack,
  Input,
  List,
  Text,
  ListItem,
  Box,
  Link,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useDisclosureStore } from "@/store/disclosure";
import { Button } from "../universal/button";

interface Article {
  path: string;
  title: string;
}

const articles: Article[] = [
  { path: "/tutorial/theEscapists", title: "逃脱者：困境突围（附联机工具）" },
  { path: "/tutorial/juicyRealm/1", title: "恶果之地" },
  { path: "/tutorial/aresVirus2/1", title: "阿瑞斯病毒2" },
  { path: "/tutorial/stardewValley/1", title: "星露谷物语" },
  { path: "/tutorial/wizardOfLegend/1", title: "传说法师" },
  { path: "/tutorial/soulKnight/1", title: "元气骑士" },
  { path: "/tutorial/otherworldLegends/1", title: "战魂铭人" },
  { path: "/tutorial/minecraft/1", title: "我的世界" },
  { path: "/tutorial/terraria/1", title: "泰拉瑞亚" },
];

export const GameListModal = () => {
  const router = useRouter();

  const { isOpen: gameListIsOpen, onToggle: gameListOnToggle } =
    useDisclosureStore((state) => {
      return state.modifyGameListDisclosure;
    });

  const [searchTerm, setSearchTerm] = useState("");

  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Modal isOpen={gameListIsOpen} onClose={gameListOnToggle}>
      <ModalOverlay />
      <ModalContent bgColor="#002f5c" mx={3} my={12}>
        {/* <ModalHeader pb={0} textAlign="center">联机教程</ModalHeader> */}

        <ModalCloseButton />

        <ModalBody mx={2} my={3}>
          <VStack mb={3}>
            <Text>联机需先学会使用WG连接喵服</Text>

            <Button
              size="sm"
              onClick={() => {
                gameListOnToggle();
                router.push("/tutorial");
              }}
            >
              &gt;&gt; 查看连接喵服教程 &lt;&lt;
            </Button>
          </VStack>

          <Text textAlign="center">支持但不限于以下游戏，欢迎补充</Text>

          <Input
            placeholder="输入关键字搜索"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            mb={4}
          />
          <Box maxHeight="300px" overflowY="auto">
            <List spacing={2}>
              {filteredArticles.map((article) => (
                <ListItem key={article.path}>
                  <Link
                    as={NextLink}
                    href={article.path}
                    color="#7dfffe"
                    _hover={{ textDecoration: "none" }}
                    onClick={gameListOnToggle}
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
