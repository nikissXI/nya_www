"use client";

import { Center, Box, Flex } from "@chakra-ui/react";
import { useUserStateStore } from "@/store/user-state";
import { useEffect } from "react";

const RelateGroups = () => {
  const { getServerData, serverData } = useUserStateStore();

  useEffect(() => {
    if (serverData === undefined) {
      getServerData(); // 只在数据为空时请求
    }
  }, [serverData, getServerData]);

  return (
    <Box
      as="footer"
      minW="240px"
      flex={{ base: "none", md: "1" }} // 桌面端占据 1/3 宽度
    >
      <Flex
        justifyContent="space-between"
        direction="column"
        pt={{ base: "5", md: "24" }}
        pb="100px"
        top={0}
        position="sticky"
      >
        <Center fontWeight="bold" color="#a8d1ff" my={1} textAlign="center">
          喵服关联QQ群
        </Center>

        {serverData?.relateGroup?.map(
          (group, index) =>
            group.qq !== 1047464328 &&
            group.qq !== 924644467 && (
              <Center key={index} my={1}>
                {group.name} - {group.qq}
              </Center>
            )
        )}
        <Center my={1}>综合服务群 - 1047464328</Center>
      </Flex>
    </Box>
  );
};

export default RelateGroups;
