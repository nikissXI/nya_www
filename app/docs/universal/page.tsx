import {
  Divider,
  Text,
  Heading,
  List,
  ListIcon,
  ListItem,
  Link,
} from "@chakra-ui/react";
import { MdTipsAndUpdates } from "react-icons/md";
import DocBox from "@/components/docs/DocBox";
import BackButton from "@/components/docs/BackButton";

export default function Page() {
  return (
    <DocBox>
      <Heading size="lg" textAlign="center">
        通用组网联机教程
      </Heading>

      <Text my={3}>
        本教程适用于所有支持通过IP加入的游戏，如果是搜索或邀请加入的游戏就要看游戏是否支持了
      </Text>

      <Heading mt={3} size="md">
        一、联机前准备
      </Heading>
      <List spacing={2} mt={2}>
        <ListItem>
          ①
          约定联机房间里的一名玩家作为主机，主机负责创建游戏，其他玩家作为客机加入
        </ListItem>
        <ListItem>
          ② 记录主机的喵服IP和游戏端口，在联机房间里能看到每个玩家的喵服IP，形如
          “100.64.0.8”，端口由游戏的联机设置决定
        </ListItem>
      </List>

      <Heading mt={5} size="md">
        二、主机操作
      </Heading>
      <List spacing={2} mt={2}>
        <ListItem>① 进入游戏选联机模式，按游戏提示创建世界或房间</ListItem>
        <ListItem>
          ② 保持游戏运行，等待客机加入游戏，主机把他的喵服IP和端口告诉客机，
        </ListItem>
      </List>

      <Heading mt={5} size="md">
        三、客机操作
      </Heading>
      <List spacing={2} mt={2}>
        <ListItem>进入游戏选联机模式，加入游戏的选项中</ListItem>
        <ListItem>
          情况①
          直接填写主机的喵服IP加入，如“100.64.0.8:12345”（如果有端口输入框，需单独填写端口）；部分游戏使用命令加入，命令请自行搜索
        </ListItem>
        <ListItem>
          情况② 搜索或由主机邀请加入，无法填写IP，则看游戏的支持情况了，自行尝试
        </ListItem>
      </List>

      <Heading mt={5} size="md">
        四、无法加入时检查
      </Heading>
      <List spacing={2} mt={2}>
        <ListItem>
          <ListIcon as={MdTipsAndUpdates} />
          检查主机是否仍在游戏中、端口是否正确，以及游戏版本、模组等是否一致
        </ListItem>
        <ListItem>
          <ListIcon as={MdTipsAndUpdates} />
          Windows做主机时，如果客机无法加入，把系统防火墙关了再试试看
          <Link
            href="https://zhuanlan.zhihu.com/p/397675766"
            color="#7dd4ff"
            target="_blank"
          >
            不会关点我
          </Link>
        </ListItem>
        <ListItem>
          <ListIcon as={MdTipsAndUpdates} />
          如果还有其他情况请加喵服官方QQ群沟通
        </ListItem>
      </List>

      <BackButton />
    </DocBox>
  );
}
