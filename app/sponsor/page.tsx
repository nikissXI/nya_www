"use client";

import {
  Box,
  Text,
  Image,
  VStack,
  SimpleGrid,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from "@chakra-ui/react";

interface SponsorItem {
  uid: number;
  username: string;
  sponsorship: number;
}

const sponsorList: SponsorItem[] = [
  {
    uid: 7080,
    username: "R32",
    sponsorship: 1688,
  },
  {
    uid: 446,
    username: "浅梦",
    sponsorship: 444,
  },
  {
    uid: 650,
    username: "白橘子抱枕",
    sponsorship: 360,
  },
  {
    uid: 668,
    username: "独酌对月心思故",
    sponsorship: 333,
  },
  {
    uid: 9,
    username: "帕瓦",
    sponsorship: 328,
  },
  {
    uid: 1338,
    username: "说多都是泪",
    sponsorship: 321,
  },
  {
    uid: 7055,
    username: "慕逢春",
    sponsorship: 302,
  },
  {
    uid: 7084,
    username: "你笑",
    sponsorship: 300,
  },
  {
    uid: 4,
    username: "伪善",
    sponsorship: 274,
  },
  {
    uid: 7064,
    username: "空谷幽兰",
    sponsorship: 240,
  },
  {
    uid: 7050,
    username: "白眼",
    sponsorship: 233,
  },
  {
    uid: 11,
    username: "大梦谁先觉",
    sponsorship: 210,
  },
  {
    uid: 1336,
    username: "柜人多望事",
    sponsorship: 206,
  },
  {
    uid: 174,
    username: "门屠",
    sponsorship: 206,
  },
  {
    uid: 7026,
    username: "用户9650",
    sponsorship: 200,
  },
  {
    uid: 557,
    username: "Chidori子不语",
    sponsorship: 200,
  },
  {
    uid: 175,
    username: "咕言咕语",
    sponsorship: 200,
  },
  {
    uid: 6984,
    username: "瑶某人",
    sponsorship: 200,
  },
  {
    uid: 406,
    username: "落羽之地",
    sponsorship: 200,
  },
  {
    uid: 1337,
    username: "水中巴黎",
    sponsorship: 200,
  },
  {
    uid: 6977,
    username: "zzZZZZ",
    sponsorship: 200,
  },
  {
    uid: 779,
    username: "云歌",
    sponsorship: 200,
  },
  {
    uid: 113,
    username: "胡子大叔",
    sponsorship: 200,
  },
  {
    uid: 7065,
    username: "用户1499",
    sponsorship: 200,
  },
  {
    uid: 1335,
    username: "伊邪那岐小神",
    sponsorship: 200,
  },
  {
    uid: 6948,
    username: "用户1832",
    sponsorship: 200,
  },
  {
    uid: 164,
    username: "王有胜",
    sponsorship: 162,
  },
  {
    uid: 7162,
    username: "用户2789",
    sponsorship: 150,
  },
  {
    uid: 101,
    username: "夢想楽土",
    sponsorship: 150,
  },
  {
    uid: 62,
    username: "Hannibal",
    sponsorship: 130,
  },
  {
    uid: 38,
    username: "阿宝",
    sponsorship: 130,
  },
  {
    uid: 7110,
    username: "用户2124",
    sponsorship: 130,
  },
  {
    uid: 6943,
    username: "失约",
    sponsorship: 130,
  },
  {
    uid: 7146,
    username: "雏田",
    sponsorship: 124,
  },
  {
    uid: 6957,
    username: "正经人",
    sponsorship: 120,
  },
  {
    uid: 116,
    username: "百分百纯度",
    sponsorship: 114,
  },
  {
    uid: 185,
    username: "猫猫",
    sponsorship: 105,
  },
  {
    uid: 7115,
    username: "Mean机器",
    sponsorship: 100,
  },
  {
    uid: 7173,
    username: "六花等着你",
    sponsorship: 100,
  },
  {
    uid: 7108,
    username: "红袖",
    sponsorship: 100,
  },
  {
    uid: 7002,
    username: "AIs",
    sponsorship: 100,
  },
  {
    uid: 7016,
    username: "Shooting",
    sponsorship: 100,
  },
  {
    uid: 330,
    username: "铱盐盯帧",
    sponsorship: 100,
  },
  {
    uid: 7061,
    username: "一个句号",
    sponsorship: 100,
  },
  {
    uid: 7076,
    username: "雾雨城久梦",
    sponsorship: 100,
  },
  {
    uid: 7085,
    username: "用户1812",
    sponsorship: 100,
  },
  {
    uid: 7078,
    username: "清风明月几时有",
    sponsorship: 100,
  },
  {
    uid: 417,
    username: "优莱卡",
    sponsorship: 100,
  },
  {
    uid: 440,
    username: "元海",
    sponsorship: 100,
  },
  {
    uid: 502,
    username: "坏丫头冬冬",
    sponsorship: 100,
  },
  {
    uid: 6,
    username: "AOUI",
    sponsorship: 100,
  },
  {
    uid: 10,
    username: "十六",
    sponsorship: 100,
  },
  {
    uid: 7,
    username: "用户2954",
    sponsorship: 100,
  },
  {
    uid: 26,
    username: "随笔",
    sponsorship: 100,
  },
  {
    uid: 27,
    username: "叶枼耶耶椰",
    sponsorship: 100,
  },
  {
    uid: 28,
    username: "用户3061",
    sponsorship: 100,
  },
  {
    uid: 45,
    username: "我很好谢谢你呢",
    sponsorship: 100,
  },
  {
    uid: 46,
    username: "暗の鬼炎",
    sponsorship: 100,
  },
  {
    uid: 49,
    username: "王德发",
    sponsorship: 100,
  },
  {
    uid: 66,
    username: "格拉斯贝恩",
    sponsorship: 100,
  },
  {
    uid: 68,
    username: "文森六世",
    sponsorship: 100,
  },
  {
    uid: 82,
    username: "茶綠喵_绿茶",
    sponsorship: 100,
  },
  {
    uid: 90,
    username: "kemomimi酱",
    sponsorship: 100,
  },
  {
    uid: 112,
    username: "ミ隱世く",
    sponsorship: 100,
  },
  {
    uid: 142,
    username: "蚊子",
    sponsorship: 100,
  },
  {
    uid: 125,
    username: "阿伟",
    sponsorship: 100,
  },
  {
    uid: 180,
    username: "脆脆鲨",
    sponsorship: 100,
  },
  {
    uid: 6990,
    username: "DS啊",
    sponsorship: 100,
  },
  {
    uid: 6966,
    username: "XQ",
    sponsorship: 100,
  },
  {
    uid: 6994,
    username: "用户6090",
    sponsorship: 100,
  },
  {
    uid: 7117,
    username: "圣愿之祭",
    sponsorship: 100,
  },
  {
    uid: 7147,
    username: "松山柳柏",
    sponsorship: 100,
  },
  {
    uid: 7193,
    username: "well",
    sponsorship: 100,
  },
  {
    uid: 71,
    username: "萧鋈",
    sponsorship: 69,
  },
  {
    uid: 7189,
    username: "Cator",
    sponsorship: 66,
  },
  {
    uid: 7025,
    username: "慕雨 丶无痕",
    sponsorship: 66,
  },
  {
    uid: 7120,
    username: "hubris",
    sponsorship: 63,
  },
  {
    uid: 5,
    username: "清吾",
    sponsorship: 60,
  },
  {
    uid: 7112,
    username: "元戎还望",
    sponsorship: 60,
  },
  {
    uid: 6980,
    username: "微笑",
    sponsorship: 60,
  },
  {
    uid: 7144,
    username: "白色月牙",
    sponsorship: 60,
  },
  {
    uid: 15771,
    username: "wowaka",
    sponsorship: 50,
  },
  {
    uid: 6962,
    username: "MuMu",
    sponsorship: 50,
  },
  {
    uid: 7074,
    username: "haha",
    sponsorship: 50,
  },
  {
    uid: 7137,
    username: "小幽",
    sponsorship: 50,
  },
  {
    uid: 7181,
    username: "拓尔米基始",
    sponsorship: 50,
  },
  {
    uid: 7149,
    username: "Rainbow",
    sponsorship: 50,
  },
  {
    uid: 8,
    username: "忆梦",
    sponsorship: 50,
  },
  {
    uid: 169,
    username: "无语Y",
    sponsorship: 50,
  },
  {
    uid: 7122,
    username: "八嘎呀路",
    sponsorship: 50,
  },
  {
    uid: 122,
    username: "青空",
    sponsorship: 50,
  },
  {
    uid: 15306,
    username: "阿龙龙",
    sponsorship: 50,
  },
  {
    uid: 85,
    username: "小肥羊",
    sponsorship: 50,
  },
  {
    uid: 7054,
    username: "用户1339",
    sponsorship: 50,
  },
  {
    uid: 335,
    username: "夜",
    sponsorship: 50,
  },
];

const maskNumber = (number: string): string => {
  return number.replace(/.(?=.{4})/g, "*");
};

const Page = () => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      mx={5}
    >
      <VStack spacing={3}>
        <Text fontSize="2xl" fontWeight="bold">
          感谢赞助者们的支持！
        </Text>

        <Text fontSize="sm">仅列出赞助不低于50元赞助者，敬请谅解！</Text>

        <TableContainer maxH="240px" overflowY="auto" overflowX="hidden">
          <Table variant="striped" colorScheme="transparent" w="300px">
            <Thead position="sticky" top={0} bg="#3e4e63">
              <Tr>
                <Th color="white" fontSize="md" w="30%" p={3}>
                  UID
                </Th>
                <Th color="white" fontSize="md" w="30%" p={3}>
                  用户名
                </Th>
                <Th color="white" fontSize="md" w="70%" p={3}>
                  金额(元)
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {sponsorList.map((item, index) => (
                <Tr key={index}>
                  <Td p={3}>{item.uid} </Td>
                  <Td p={3}>{item.username} </Td>
                  <Td p={3}>{item.sponsorship}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>

        <Text textAlign="left">
          喵服由服主一人纯公益运营，赞助将帮助喵服持续提供联机服务。付款时可备注您的喵服账号UID（不是编号别搞错了），服主会记录赞助金额，金额将可以在我的信息界面查看。
        </Text>

        <SimpleGrid columns={2} spacing={1}>
          <Image
            w="200px"
            src="/images/sponsor/支付宝收款.jpg"
            alt="支付宝收款"
          />
          <Image w="200px" src="/images/sponsor/微信收款.jpg" alt="微信收款" />
        </SimpleGrid>
      </VStack>
    </Box>
  );
};

export default Page;
