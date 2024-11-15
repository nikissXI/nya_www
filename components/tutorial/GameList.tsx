"use client";

import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  VStack,
  Input,
  List,
  Text,
  ListItem,
  Box,
  Divider,
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
  { path: "/tutorial/theEscapists", title: "逃脱者（不看搜不到房间）" },
  { path: "/tutorial/juicyRealm", title: "恶果之地" },
  { path: "/tutorial/aresVirus2", title: "阿瑞斯病毒2" },
  { path: "/tutorial/stardewValley", title: "星露谷物语" },
  { path: "/tutorial/wizardOfLegend", title: "传说法师" },
  { path: "/tutorial/soulKnight", title: "元气骑士" },
  { path: "/tutorial/otherworldLegends", title: "战魂铭人" },
  { path: "/tutorial/minecraft", title: "我的世界" },
  { path: "/tutorial/terraria", title: "泰拉瑞亚" },
  { path: "/tutorial/l4d2", title: "求生之路2" },
];

export const GameListModal = () => {
  const router = useRouter();

  const [tutorialColor, setTutorialColor] = useState(true);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined; // 定义变量以存储定时器ID

    intervalId = setInterval(() => {
      setTutorialColor((prev) => !prev);
    }, 500);

    // 清理定时器
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []); // 将 stopChanging 作为依赖项

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
        <ModalCloseButton />

        <ModalBody mx={2} my={3}>
          <VStack mb={3}>
            <Text
              fontSize="md"
              mx={5}
              fontWeight="bold"
              color={tutorialColor ? "#ff0000" : "white"}
            >
              提示离线不知道做的，WG不知道哪下载怎么连的，
              <Button
                variant="link"
                bg="transparent"
                color="#7dfffe"
                onClick={() => {
                  gameListOnToggle();
                  router.push("/tutorial");
                }}
              >
                点我点我点我
              </Button>
            </Text>
          </VStack>

          <Divider my={2} />

          <Text fontSize="md" textAlign="center">
            下面只是游戏联机教程，先看上面的
          </Text>

          <Input
            placeholder="搜索游戏教程"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            mb={4}
          />
          <Box maxHeight="300px" overflowY="auto">
            <List spacing={2}>
              {filteredArticles.map((article) => (
                <ListItem key={article.path}>
                  <Link
                    fontSize="md"
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
