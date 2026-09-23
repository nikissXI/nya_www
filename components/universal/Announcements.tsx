import { useEffect, useState } from "react";
import { Box, Divider, Flex, Icon, Text, VStack } from "@chakra-ui/react";
import { MdCampaign } from "react-icons/md";
import { useUserStateStore } from "@/store/user-state";
import { formatAnnouncementDate } from "@/utils/strings";

/**
 * 公告展示组件
 * ------------------------------------------------------------------
 * 站内两处公告展示都收在这里，避免各页面各写一份：
 * - `AnnouncementCarousel`：房间页顶部的轮播条（每 6 秒换一条 carouselMsg）
 * - `AnnouncementList`：侧栏「历史公告」弹窗里的完整列表（自带空态）
 */

/** 轮播公告条 */
export function AnnouncementCarousel() {
  const carouselMsg = useUserStateStore(
    (s) => s.announcementsData?.carouselMsg,
  );
  const [index, setIndex] = useState(0);

  // 每条显示 6 秒
  useEffect(() => {
    if (!carouselMsg?.length) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % carouselMsg.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [carouselMsg]);

  // 取模兜底：公告条数变少时不会取到 undefined
  const current = carouselMsg?.length
    ? carouselMsg[index % carouselMsg.length]
    : undefined;

  if (!current) return null;

  return (
    <Flex
      align="center"
      gap={2}
      px={3}
      py={2}
      minH="38px"
      borderRadius="lg"
      bg="rgba(255, 202, 61, 0.12)"
      border="1px solid"
      borderColor="rgba(255, 202, 61, 0.3)"
    >
      <Icon as={MdCampaign} boxSize={4} color="#ffca3d" flexShrink={0} />

      <Text fontSize="sm" color="#ffd964" textAlign="left" flex={1}>
        {current}
      </Text>
    </Flex>
  );
}

/** 历史公告列表（时间 + 内容，空数据时显示占位） */
export function AnnouncementList() {
  const announcements = useUserStateStore(
    (s) => s.announcementsData?.announcements,
  );

  if (!announcements?.length) {
    return (
      <Text
        py={4}
        fontSize="sm"
        color="rgba(255, 255, 255, 0.6)"
        textAlign="center"
      >
        暂无公告
      </Text>
    );
  }

  return (
    <VStack spacing={3} align="stretch">
      {announcements.map((item) => (
        <Box key={item.timestamp}>
          <Text fontSize="sm" fontWeight="bold" color="#f4d106" textAlign="left">
            {formatAnnouncementDate(item.timestamp)}
          </Text>

          <Divider my={2} borderColor="rgba(255, 255, 255, 0.12)" />

          <Text fontSize="sm" whiteSpace="pre-wrap" textAlign="left">
            {item.content}
          </Text>
        </Box>
      ))}
    </VStack>
  );
}
