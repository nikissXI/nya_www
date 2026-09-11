import React from "react";
import { Flex, Text, Box, Icon } from "@chakra-ui/react";
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
      <Box fontSize="sm" mb={3}>
        <Text fontSize="md" as="span" color="#ff734f" fontWeight="bold">
          联机提示
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
