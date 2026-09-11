import React from "react";
import {
  Flex,
  Text,
  Box,
  Icon,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  VStack,
  Link,
} from "@chakra-ui/react";
import { MdTipsAndUpdates } from "react-icons/md";

export default function DocBox({ children }: { children: React.ReactNode }) {
  return (
    <Box maxW="900px" mx="auto" px={{ base: 4, md: 8 }} pb={5}>
      <Alert
        maxW="900px"
        mx="auto"
        mb={5}
        status="warning"
        variant="subtle"
        bg="rgba(52, 139, 246, 0.18)"
        color="white"
        borderRadius="lg"
      >
        <Box>
          <Flex align="center" color="#ffca3d">
            <AlertIcon />
            <AlertTitle fontSize="md">开始前请注意</AlertTitle>
          </Flex>
          <AlertDescription fontSize="sm">
            <VStack align="stretch" spacing={1} mt={1}>
              <Text>
                <Icon as={MdTipsAndUpdates} mr={1} />
                开始联机前请确保玩家在同一个喵服联机房间并都在线
              </Text>
              <Text>
                <Icon as={MdTipsAndUpdates} mr={1} />
                主机：指联机模式中创建多人游戏的设备
              </Text>
              <Text>
                <Icon as={MdTipsAndUpdates} mr={1} />
                客机：指联机模式中加入多人游戏的设备
              </Text>
              <Text>
                <Icon as={MdTipsAndUpdates} mr={1} />
                手机或平板做主机时，要保持在游戏中，否则客机无法加入或掉线
              </Text>
            </VStack>
          </AlertDescription>
        </Box>
      </Alert>

      {children}
    </Box>
  );
}
