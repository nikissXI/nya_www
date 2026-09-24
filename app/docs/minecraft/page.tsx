import { Divider, Flex, Heading, List, ListItem, Text } from "@chakra-ui/react";
import { Icon } from "@chakra-ui/react";
import { MdTipsAndUpdates } from "react-icons/md";
import DocBox from "@/components/docs/DocBox";
import DocLink from "@/components/docs/DocLink";
import BackButton from "@/components/docs/BackButton";
import { ExtLink } from "@/components/docs/DocParts";

export default function Page() {
  const TextList = [
    "喵服关联QQ群：908023778",
    "玩家都处于同个联机房间并在线后，主机创建局域网游戏或运行服务端，其他人填主机的联机IP加入就行",
    "服务器名称随意，服务器地址格式“喵服IP:端口号”，如主机的喵服联机IP为“100.64.0.1”，端口号为“12345”，则填写“100.64.0.1:12345”（注意：基岩版的IP地址和端口号是分开两个框填写的）",
    "如果加入时提示“无效会话”，自行去B站搜索“我的世界无效会话怎么解决”，有一堆教程，最简单的方法就是买正版",
    "如果加入失败提示“Connection reset”，并且主机是windows系统，主机关闭系统防火墙再试",
    "其他加入报错请自行搜索解决，或赞助后找服主提供技术支持",
    "建议使用2M及以上带宽的节点，视距开低（如6左右），否则加载地图易卡顿",
  ];

  return (
    <DocBox>
      <Text my={3} fontSize="lg" lineHeight="1.9">
        电脑端联机建议用UU加速器(里面有免费组网联机功能)，比喵服更简单易用
        <ExtLink href="https://uu.163.com/">https://uu.163.com/</ExtLink>
        <br />
        UU加速器联机使用教程
        <ExtLink href="https://www.bilibili.com/video/BV1wbQbBmEPv/">
          https://www.bilibili.com/video/BV1wbQbBmEPv/
        </ExtLink>
      </Text>

      <Heading size="lg" textAlign="center">
        Java、基岩版通用
      </Heading>

      <DocLink
        linkText="简略视频演示"
        linkUrl="https://www.bilibili.com/video/BV1UX4GegEAf/"
      />

      <List spacing={2.5}>
        {TextList.map((reason, index) => (
          <ListItem key={index} textAlign="left">
            <Flex align="flex-start" gap={2}>
              <Icon
                as={MdTipsAndUpdates}
                boxSize={4}
                color="brand.text"
                flexShrink={0}
                mt="3px"
              />
              <Text fontSize="sm" color="text.muted" lineHeight="1.8">
                {reason}
              </Text>
            </Flex>
          </ListItem>
        ))}
      </List>

      <Divider my={5} />

      <BackButton />
    </DocBox>
  );
}
