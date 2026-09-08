import React from "react";
import { Flex, Text, Box, Icon, Button } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { MdTipsAndUpdates } from "react-icons/md";

const DocFlex = ({ children }: { children: React.ReactNode }) => {
  return (
    <Flex
      direction="column"
      justifyContent="space-between"
      alignItems="left"
      mb={5}
      mx="5vw"
    >
      <Box
        bg="rgba(52, 139, 246, 0.12)"
        border="1px solid rgba(125, 212, 255, 0.25)"
        borderRadius="lg"
        p={4}
        mb={4}
      >
        <Text fontSize="md" as="span" color="#7dd4ff" fontWeight="bold">
          先看 WG 安装部署教程
        </Text>
        <Text mt={2} fontSize="sm" color="white">
          先完成 WG 客户端安装和隧道导入，再操作具体游戏联机步骤，能更稳定地进入房间。
        </Text>
        <Button
          as={RouterLink}
          to="/docs"
          mt={3}
          size="sm"
          colorScheme="blue"
          variant="outline"
        >
          前往 WG 安装部署教程
        </Button>
      </Box>

      <Box fontSize="sm" mb={3}>
        <Text fontSize="md" as="span" color="#ff734f" fontWeight="bold">
          联机小贴士
        </Text>

        <Text>
          <Icon as={MdTipsAndUpdates} mr={2} />
          主机：指联机模式中创建多人游戏的设备
        </Text>
        <Text>
          <Icon as={MdTipsAndUpdates} mr={2} />
          客机：指联机模式中加入多人游戏的设备
        </Text>
        <Text>
          <Icon as={MdTipsAndUpdates} mr={2} />
          同一个联机房间中，任何人都可以做主机
        </Text>
        <Text>
          <Icon as={MdTipsAndUpdates} mr={2} />
          游戏中填写IP地址，要使用喵服的联机IP
        </Text>
        <Text>
          <Icon as={MdTipsAndUpdates} mr={2} />
          手机或平板做主机时，要保持在游戏中，否则客机无法加入或掉线
        </Text>
        <Text>
          <Icon as={MdTipsAndUpdates} mr={2} />
          电脑Windows做主机时，如果客机无法加入，把系统防火墙都关闭再试试
        </Text>
      </Box>
      {children}
    </Flex>
  );
};

export default DocFlex;
