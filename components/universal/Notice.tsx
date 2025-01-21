"user client";

import { Heading, Text, VStack } from "@chakra-ui/react";

export const NoticeText = () => {
  return (
    <VStack spacing={3} align="center">
      <Heading size="sm" pt={6}>
        温馨提示
      </Heading>
      <Text px={10} textAlign="left">
        如果网站不能正常加载或功能异常，请更换浏览器试试，以下仅做推荐
        <br />
        苹果：内置浏览器Safari
        <br />
        安卓：via、夸克
        <br />
        电脑：谷歌、火狐、edge
        <br />
        仍然无法解决就加服主QQ：1299577815
      </Text>
    </VStack>
  );
};
