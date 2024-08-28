"use client";

import { Flex, Center, List, ListItem, Image, Heading } from "@chakra-ui/react";

export function Page() {
  return (
    <Center>
      <Flex
        direction="column"
        justifyContent="space-between"
        alignItems="center"
        maxW="460px"
      >
        <Heading size="md" mb={3}>
          联机房间
        </Heading>

        <List spacing={2}>
          <ListItem>
            连上喵服后，联机的玩家需要处于同一联机房间才能通信
          </ListItem>
          <ListItem>
            为了防止玩家“窜房”引起不必要的麻烦，只有房主指定的玩家才能加入房间
          </ListItem>
          <ListItem>
            联机房间的信息通过命令“房间”查询，可以看到哪些成员已加入
          </ListItem>
          <Image
            my={3}
            src="/images/fangjian.png"
            alt="fangjian"
          />
          <ListItem>
            注意：已加入的玩家，如果30分钟没有进行联机行为，就会自动退出房间
          </ListItem>
        </List>
      </Flex>
    </Center>
  );
}
