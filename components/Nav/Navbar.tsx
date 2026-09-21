import { useLocation, useNavigate } from "react-router-dom";
import { Box, Flex, Text, Stack } from "@chakra-ui/react";
import { useEffect } from "react";
import { FaHome, FaUsers, FaUser } from "react-icons/fa";
import { useUserStateStore } from "@/store/user-state";
import { Button } from "../universal/button";

export default function Navbar({ path }: { path: string }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const getServerData = useUserStateStore((state) => state.getServerData);
  const serverData = useUserStateStore((state) => state.serverData);

  useEffect(() => {
    if (serverData === undefined) {
      getServerData();
    }
  }, [serverData, getServerData]);

  const currentPath = path || pathname;
  const rootPath = "/" + currentPath.split("/")[1];

  const rootGuide = [
    { label: "首页", path: "/", icon: FaHome },
    { label: "房间", path: "/room", icon: FaUsers },
    { label: "我的", path: "/me", icon: FaUser },
  ];

  return (
    <>
      <Box as="header" maxW="200px" flex={{ base: "none", md: "0 0 200px" }}>
        <Flex
          display={{ base: "none", md: "flex" }}
          justifyContent="space-between"
          direction="column"
          pt={12}
          top={0}
          position="sticky"
        >
          <Flex as="nav" direction="column" py={10} px={8}>
            {rootGuide.map(({ label, path: itemPath, icon: Icon }) => {
              const isActive = rootPath === itemPath;
              return (
                <Flex
                  key={itemPath}
                  // 图标与文字同一行，水平/垂直都居中
                  align="center"
                  justify="center"
                  gap={2}
                  my={3}
                  py={3}
                  px={2}
                  rounded={12}
                  fontSize="lg"
                  fontWeight="bold"
                  color={isActive ? "white" : "gray.200"}
                  bg={isActive ? "#4098f282" : "transparent"}
                  cursor="pointer"
                  _hover={{
                    bg: isActive ? "#4098f282" : "whiteAlpha.100",
                  }}
                  onClick={() => navigate(itemPath)}
                >
                  <Icon />
                  <Text lineHeight="1">{label}</Text>
                </Flex>
              );
            })}
          </Flex>
        </Flex>
      </Box>

      <Flex
        as="nav"
        bg="#1b1e25"
        color="white"
        position="fixed"
        bottom="0"
        left="0"
        right="0"
        justifyContent="space-around"
        display={{ md: "none", base: "flex" }}
        zIndex={100}
      >
        {rootGuide.map(({ label, path: itemPath, icon: Icon }) => (
          <Button
            key={itemPath}
            padding="1rem"
            variant="link"
            bg="transparent"
            colorScheme="transparent"
            color={rootPath === itemPath ? "#47cdff" : "white"}
            onClick={() => navigate(itemPath)}
          >
            <Stack spacing={0} align="center">
              <Icon />
              <Text fontSize="xs">{label}</Text>
            </Stack>
          </Button>
        ))}
      </Flex>
    </>
  );
}
