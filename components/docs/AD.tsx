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

type SponsorAdProps = {
  sponsorName?: string;
  discountText?: string;
  offerLink?: string;
  logoSrc?: string;
};

const SponsorAd: React.FC<SponsorAdProps> = ({
  sponsorName = "雨云",
  discountText = "新人注册享首月5折优惠",
  offerLink = "https://www.rainyun.com/Njg2ODY1_",
  logoSrc = "https://app.rainyun.com/img/icons/apple-touch-icon-152x152.png",
}) => {
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
              src={logoSrc}
              alt={`${sponsorName} Logo`}
              boxSize={{ base: "60px", md: "80px" }}
              objectFit="contain"
              rounded="md"
              shadow="sm"
              bg={boxBg}
              p={2}
            />
          </Box>
          <Stack
            flex="1"
            spacing={1}
            textAlign={{ base: "center", md: "left" }}
          >
            <Heading size="md" color={accentColor} letterSpacing="wide">
              赞助商 · {sponsorName}
            </Heading>
            <Text
              fontSize="sm"
              color={useColorModeValue("gray.700", "gray.300")}
            >
              {discountText}
            </Text>
            <Link
              href={offerLink}
              isExternal
              _hover={{ textDecoration: "none" }}
            >
              <Button
                colorScheme="blue"
                size="sm"
                w={{ base: "full", md: "auto" }}
                aria-label={`访问${sponsorName}官网`}
              >
                立即注册
              </Button>
            </Link>
          </Stack>
        </Flex>
      </Box>

      <Text color="#ffca3d" fontWeight="bold" textAlign="center" mx={5}>
        喵服于5月15日上午9时停服维护，看不到该公告的时候就是维护完毕了
      </Text>
    </VStack>
  );
};

export default SponsorAd;
