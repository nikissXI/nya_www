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
import { useUserStateStore } from "@/store/user-state";

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
  { path: "/tutorial/doNotStarve", title: "饥荒" },
  // { path: "/tutorial/civilization6", title: "文明6" },
  { path: "/tutorial/minecraft", title: "我的世界" },
  { path: "/tutorial/terraria", title: "泰拉瑞亚" },
  { path: "/tutorial/l4d2", title: "求生之路2" },
];

export const GameListModal = () => {
  const router = useRouter();

  const [tutorialColor, setTutorialColor] = useState(true);

  const [hideGameList, setHideGameList] = useState(true);

  const { latency } = useUserStateStore();

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined; // 定义变量以存储定时器ID

    if (hideGameList) {
      intervalId = setInterval(() => {
        setTutorialColor((prev) => !prev);
      }, 500);
    } else {
      setTutorialColor(true);
    }

    // 清理定时器
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [hideGameList]);

  useEffect(() => {
    if (latency) setHideGameList(false);
  }, [latency]);

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
          <VStack mb={3} w="100%">
            <Text
              align="center"
              fontSize="md"
              mx={5}
              fontWeight="bold"
              color={tutorialColor ? "white" : "#ff6868"}
            >
              提示离线不知道做的
              <br />
              不知道WG哪下载怎么连的
              <br />
              WG隧道不知道哪里下载的
            </Text>

            <Button
              variant="link"
              bg="transparent"
              color="#7dfffe"
              onClick={() => {
                gameListOnToggle();
                router.push("/tutorial");
              }}
            >
              点我查看WG部署教程
            </Button>

            <Divider my={0} />

            <Box hidden={!hideGameList} textAlign="center">
              <Text textAlign="left">
                教程分两部分，上面是连接喵服的教程，下面的具体游戏的联机教程
              </Text>

              <Divider my={2} />

              <Button
                variant="link"
                bg="transparent"
                color="#7dfffe"
                onClick={() => {
                  setHideGameList(false);
                }}
              >
                已会部署WG，看游戏的联机教程
              </Button>
            </Box>

            <Box hidden={hideGameList}>
              <Text fontSize="md" textAlign="center">
                列表以外的游戏请自行尝试联机
                <br />
                欢迎找群主投稿其他游戏的教程
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
            </Box>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
