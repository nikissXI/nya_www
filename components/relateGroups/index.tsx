"use client";

// import { useEffect, useState, useCallback } from "react";
import { Center, Box, Flex } from "@chakra-ui/react";
import { ArrowDownIcon } from "@chakra-ui/icons";

// interface GroupItem {
//   name: string;
//   qq: number;
// }

// interface GroupData {
//   main: GroupItem[];
//   relate: GroupItem[];
// }

const RelateGroupList = () => {
  // const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // const [groupData, setData] = useState<GroupData>({
  //   main: [],
  //   relate: [],
  // });
  // const [loading, setLoading] = useState<boolean>(true);
  // const [error, setError] = useState<string | null>(null);

  // const fetchData = useCallback(async () => {
  //   try {
  //     const resp = await fetch(`${apiUrl}/relateGroup`);
  //     if (!resp.ok) {
  //       throw new Error("获取关联群信息出错");
  //     }
  //     const data = await resp.json();
  //     setData(data);
  //   } catch (err) {
  //     setError(err instanceof Error ? err.message : "获取关联群信息出错");
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [apiUrl]);

  // useEffect(() => {
  //   if (groupData.main.length === 0) {
  //     fetchData(); // 只在数据为空时请求
  //   } else {
  //     setLoading(false); // 数据已缓存，直接设置加载状态
  //   }
  // }, [fetchData, groupData]);

  // if (loading) {
  //   return;
  // }

  // if (error) {
  //   return <Center color="red.500">{error}</Center>;
  // }

  const groupData = {
    main: [
      {
        name: "喵服联机总群",
        qq: 1047464328,
      },
    ],
    relate: [
      {
        name: "恶果之地",
        qq: 981282876,
      },
      {
        name: "星露谷物语",
        qq: 817658554,
      },
      {
        name: "传说法师",
        qq: 981286541,
      },
      {
        name: "逃脱者",
        qq: 961793250,
      },
      {
        name: "泰拉瑞亚",
        qq: 976129564,
      },
      {
        name: "阿瑞斯病毒2",
        qq: 966579113,
      },
      {
        name: "求生之路2",
        qq: 138012638,
      },
      {
        name: "我的世界",
        qq: 908023778,
      },
      {
        name: "机械战争3",
        qq: 689358384,
      },
      {
        name: "战魂铭人",
        qq: 981280745,
      },
      {
        name: "饥荒",
        qq: "未创建",
      },
    ],
  };

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
        {/* <Center fontWeight="bold" fontSize="xl" color="#a8d1ff">
          <ArrowDownIcon display={{ base: "flex", md: "none" }} />
          喵服关联QQ群
          <ArrowDownIcon display={{ base: "flex", md: "none" }} />
        </Center>

        {groupData.main.map((group, index) => (
          <Center key={index} my={1}>
            {group.name} - {group.qq}
          </Center>
        ))} */}

        <Center fontWeight="bold" color="#a8d1ff" my={1} textAlign="center">
          支持但不限于以下游戏
          <br />
          右侧数字是QQ交流群
        </Center>

        {groupData.relate.map((group, index) => (
          <Center key={index} my={1}>
            {group.name} - {group.qq}
          </Center>
        ))}
      </Flex>
    </Box>
  );
};

export default RelateGroupList;
