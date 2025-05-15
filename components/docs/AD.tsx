import React from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Link,
  useColorModeValue,
  Image,
  Stack,
  VStack,
} from "@chakra-ui/react";

const SponsorAd = () => {
  const bg = useColorModeValue("gray.50", "gray.700");
  const boxBg = useColorModeValue("white", "gray.800");
  const accentColor = useColorModeValue("blue.500", "blue.300");

  return (
    <VStack spacing={1} align="center" mb={3}>
      <Box
        bg={bg}
        p={2}
        rounded="md"
        shadow="md"
        maxW="400px"
        mx="auto"
        borderWidth="1px"
        borderColor={useColorModeValue("gray.200", "gray.600")}
        mb={2}
      >
        <Flex align="center" direction="row" gap={4}>
          <Box flexShrink={0}>
            <Image
              src="/images/yuyun.png"
              alt="Logo"
              boxSize="80px"
              objectFit="contain"
              rounded="md"
              shadow="sm"
              bg={boxBg}
            />
          </Box>
          <Stack
            flex="1"
            spacing={1}
            textAlign="center"
          >
            <Heading size="sm" color={accentColor} letterSpacing="wide">
              喵服赞助商 · 雨云
            </Heading>
            <Text
              fontSize="sm"
              color={useColorModeValue("gray.700", "gray.300")}
            >
              新人注册享首月5折优惠
            </Text>
            <Link
              href="https://www.rainyun.com/Njg2ODY1_"
              isExternal
              _hover={{ textDecoration: "none" }}
            >
              <Button
                colorScheme="blue"
                size="sm"
                w="full"
                aria-label={`访问雨云官网`}
              >
                我要买服务器！
              </Button>
            </Link>
          </Stack>
        </Flex>
      </Box>

      {/* <Text color="#ffca3d" fontWeight="bold" textAlign="center" mx={5}>
        喵服于5月15日早上6时停服维护，预计中午12点前恢复，看不到该公告的时候就是维护完毕了
      </Text> */}
    </VStack>
  );
};

export default SponsorAd;
