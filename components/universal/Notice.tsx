import { Flex, Heading, Icon, Text, VStack } from "@chakra-ui/react";
import { MdInfoOutline } from "react-icons/md";
import { Card } from "./ui";

/**
 * 浏览器兼容提示
 * 加载账号信息期间展示，文案保持不变，仅换成与全局一致的卡片视觉。
 */
export const NoticeText = () => {
  return (
    <Card maxW="560px" mx="auto" bg="warning.soft" borderColor="warning.line">
      <VStack spacing={2} align="stretch">
        <Flex align="center" gap={2}>
          <Icon as={MdInfoOutline} boxSize={5} color="warning.text" />
          <Heading as="h3" fontSize="md" color="warning.text">
            温馨提示
          </Heading>
        </Flex>

        <Text fontSize="sm" color="warning.text" lineHeight="1.9">
          如果网站不能正常加载或功能异常
          <br />
          请更换浏览器试试，以下仅做推荐
          <br />
          <strong>别用百度浏览器！！！！！！</strong>
          <br />
          苹果：内置浏览器Safari
          <br />
          安卓：Via、夸克、Edge、QQ
          <br />
          电脑：谷歌、Edge
          <br />
          仍然无法解决就加大群找群主(即服主)
        </Text>
      </VStack>
    </Card>
  );
};
