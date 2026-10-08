import { Flex, Icon, Text } from "@chakra-ui/react";
import { MdLockOutline } from "react-icons/md";
import { Button } from "@/components/universal/button";
import { useUserStateStore } from "@/store/user-state";

/**
 * 「需要登录」占位提示
 * ------------------------------------------------------------------
 * WG 安装教程整页对外开放后（未登录也能把步骤看完），真正依赖账号的只有三处：
 *   - 下载 / 扫码导入隧道（要用 userWgInfo.conf_text）
 *   - 切换节点（每个节点对应各自的隧道）
 *   - 刷新查看 WG 连接状态（要用房间数据）
 * 这些位置以前靠「整页藏在登录态后面」兜底，现在就地换成一句提示 + 入口按钮，
 * 用户既能看到完整流程，也知道自己卡在哪一步。
 *
 * 两种情况分开引导（都是 store 里的登录态决定的）：
 *   没登录  → 「点击登录」
 *   已登录但还没隧道（getUserInfo 会顺手弹出选节点弹窗）→ 「点击选择节点」
 *
 * block=true 给页面顶部做整体说明，默认形态给步骤中间的局部提示。
 */
export const NeedLogin = ({
  text,
  block = false,
}: {
  text: string;
  block?: boolean;
}) => {
  // 逐个字段订阅：房间/延迟等字段变化频繁，整体解构会让使用本组件的面板全部重渲染
  const userInfo = useUserStateStore((s) => s.userInfo);
  const openLoginModal = useUserStateStore((s) => s.openLoginModal);
  const setNodeListModal = useUserStateStore((s) => s.setNodeListModal);

  const notLogin = !userInfo;

  return (
    <Flex
      align="center"
      justify={block ? "center" : "flex-start"}
      flexWrap="wrap"
      gap={2}
      my={2}
      px={3}
      py={2}
      bg="brand.soft"
      border="1px solid"
      borderColor="brand.line"
      borderRadius="control"
      color="brand.text"
    >
      <Icon as={MdLockOutline} boxSize={4} flexShrink={0} />
      <Text as="span" fontSize="sm" lineHeight="1.8">
        {notLogin ? text : "你还没有隧道，先选一个节点"}
      </Text>
      <Button size="sm" onClick={notLogin ? openLoginModal : setNodeListModal}>
        {notLogin ? "点击登录" : "点击选择节点"}
      </Button>
    </Flex>
  );
};
