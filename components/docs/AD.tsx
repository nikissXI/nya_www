import React, { useEffect, useState, useRef } from "react";
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
  Fade,
} from "@chakra-ui/react";
import NextLink from "next/link";

const introTexts = [
  "新人注册享首月5折优惠",
  "专业稳定，值得信赖",
  "7天无理由退款，一元试用",
  "支持多种游戏一键开服",
  "简单易用，小白也能上手",
  "7x16小时在线技术支持",
];

const SponsorAd: React.FC = () => {
  const bg = useColorModeValue("gray.50", "gray.700");
  const boxBg = useColorModeValue("white", "gray.800");
  const accentColor = useColorModeValue("blue.500", "blue.300");
  const textColor = useColorModeValue("gray.700", "gray.300");

  const [index, setIndex] = useState(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setShow(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % introTexts.length);
        setShow(true);
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <VStack spacing={1} align="center" mb={2}>
      <Box
        bg={bg}
        p={{ base: 1, md: 2 }}
        rounded="md"
        shadow="md"
        maxW="400px"
        mx="auto"
        borderWidth="1px"
        borderColor={useColorModeValue("gray.200", "gray.600")}
      >
        <Flex align="center" direction="row" gap={{ base: 2, md: 4 }}>
          <Box flexShrink={0}>
            <Image
              src="/images/yuyun.png"
              alt="Logo"
              boxSize={{ base: "60px", md: "80px" }}
              objectFit="contain"
              rounded="md"
              shadow="sm"
              bg={boxBg}
            />
          </Box>
          <Stack flex="1" spacing={{ base: 0.5, md: 1 }} textAlign="center">
            <Heading
              size={{ base: "xs", md: "sm" }}
              color={accentColor}
              letterSpacing="wide"
            >
              喵服赞助商 · 雨云
            </Heading>

            <Box
              width="160px"
              mx="auto"
              whiteSpace="nowrap"
              overflow="hidden"
              h={{ base: "18px", md: "20px" }}
            >
              <Fade in={show} unmountOnExit>
                <Text fontSize={{ base: "xs", md: "sm" }} color={textColor}>
                  {introTexts[index]}
                </Text>
              </Fade>
            </Box>

            <Link
              href="https://www.rainyun.com/Njg2ODY1_"
              isExternal
              _hover={{ textDecoration: "none" }}
            >
              <Button
                colorScheme="blue"
                size={{ base: "xs", md: "sm" }}
                w="auto"
                aria-label={`访问雨云官网`}
              >
                立即体验
              </Button>
            </Link>
          </Stack>
        </Flex>
      </Box>

      <Text
        color="#ffca3d"
        fontSize="sm"
        fontWeight="bold"
        textAlign="center"
        mx={5}
      >
        为了提高联机稳定性，喵服换了更好的服务器，如果觉得喵服好用请赞助支持下，赞助可加服主一对一联机指导
        <Link
          fontSize="sm"
          ml={1}
          as={NextLink}
          href="/sponsor"
          color="#7dd4ff"
          _hover={{ textDecoration: "none" }}
        >
          点我赞助
        </Link>
      </Text>
    </VStack>
  );
};

export default SponsorAd;
