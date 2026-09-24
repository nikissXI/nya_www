import { useEffect, useState } from "react";
import { Box, Divider, Flex, Icon, Text, VStack } from "@chakra-ui/react";
import { MdCampaign } from "react-icons/md";
import { useUserStateStore } from "@/store/user-state";
import { formatAnnouncementDate } from "@/utils/strings";
import { EmptyState } from "./ui";

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
      py={2.5}
      minH="40px"
      borderRadius="control"
      bg="warning.soft"
      border="1px solid"
      borderColor="warning.line"
    >
      <Icon as={MdCampaign} boxSize={4} color="warning.text" flexShrink={0} />

      <Text
        fontSize="sm"
        color="warning.text"
        textAlign="left"
        flex={1}
        fontWeight="600"
      >
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
    return <EmptyState title="暂无公告" description="有新的公告会第一时间出现在这里" />;
  }

  return (
    <VStack spacing={3} align="stretch">
      {announcements.map((item) => (
        <Box key={item.timestamp}>
          <Text
            className="tabular"
            fontSize="xs"
            fontWeight="700"
            color="brand.text"
            textAlign="left"
          >
            {formatAnnouncementDate(item.timestamp)}
          </Text>

          <Divider my={2} />

          <Text
            fontSize="sm"
            color="text.muted"
            whiteSpace="pre-wrap"
            textAlign="left"
            lineHeight="1.75"
          >
            {item.content}
          </Text>
        </Box>
      ))}
    </VStack>
  );
}
