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
} from "@chakra-ui/react";
import { MdTipsAndUpdates } from "react-icons/md";

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
  const allNotices = [...defaultNotices, ...notices];

  return (
    <Box maxW="900px" mx="auto" px={{ base: 4, md: 8 }} pb={5}>
      <Alert
        status="info"
        variant="subtle"
        borderRadius="md"
        mb={5}
        bg="#dbeafe"
        color="#17324d"
      >
        <Box>
          <Flex color="#17324d">
            <AlertIcon />
            <AlertTitle fontSize="md">开始前请注意</AlertTitle>
          </Flex>

          <AlertDescription fontSize="sm">
            <VStack align="stretch" spacing={1} mt={1}>
              {allNotices.map((notice, index) => (
                <Text key={`${index}-${notice}`}>
                  <Icon as={MdTipsAndUpdates} mr={1} />
                  {notice}
                </Text>
              ))}
            </VStack>
          </AlertDescription>
        </Box>
      </Alert>

      {children}
    </Box>
  );
}
