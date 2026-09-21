import { Flex, Stack, Text } from "@chakra-ui/react";
import { FaHome, FaUsers, FaUser } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../universal/button";

export default function Footer({ path }: { path: string }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const currentPath = path || pathname;
  const rootPath = "/" + currentPath.split("/")[1];

  const navItems = [
    { label: "喵服首页", path: "/", icon: FaHome },
    { label: "联机房间", path: "/room", icon: FaUsers },
    { label: "我的信息", path: "/me", icon: FaUser },
  ];

  return (
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
      {navItems.map(({ label, path: itemPath, icon: Icon }) => {
        return (
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
        );
      })}
    </Flex>
  );
}
