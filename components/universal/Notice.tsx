import { Heading, Text, VStack } from "@chakra-ui/react";

export const NoticeText = () => {
  return (
    <VStack spacing={3} align="center">
      <Heading size="sm" pt={6}>
        温馨提示
      </Heading>
      <Text px={10} textAlign="left">
        <Text as="span" color="gold">
          如果网站不能正常加载或功能异常
          <br />
          请更换浏览器试试，以下仅做推荐
          <br />
          别用百度浏览器！！！！！！
        </Text>
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
  );
};
