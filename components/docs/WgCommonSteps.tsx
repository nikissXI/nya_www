import { Box, Flex, Icon, Text } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { useNavigate } from "react-router-dom";
import { MdTipsAndUpdates } from "react-icons/md";
import { TbReload } from "react-icons/tb";
import { Button } from "@/components/universal/button";
import { useUserStateStore } from "@/store/user-state";
import { getStatusColor } from "@/utils/strings";
import { DocDivider, HighLight } from "./DocParts";
import { NeedLogin } from "./NeedLogin";

/**
 * WG 安装教程的公用步骤
 * ------------------------------------------------------------------
 * 三种步骤在所有设备类型里完全一样，只是设备专属步骤（②③④）不同：
 *   ①  选择节点（每个节点对应各自的隧道）
 *   ⑤  打开 WG 隧道后刷新，确认是否连上
 *   ⑥  网页关闭不影响联机
 * 所以这里做成「外壳」组件：① → children（设备专属的 ②③④）→ ⑤⑥，
 * 页面每个设备面板只需把专属步骤塞进 children，不用再各写一遍。
 */

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const WgCommonSteps = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  const userWgInfo = useUserStateStore((s) => s.userWgInfo);
  const setNodeListModal = useUserStateStore((s) => s.setNodeListModal);
  const isOnline = useUserStateStore((s) => s.isOnline);
  const rotate = useUserStateStore((s) => s.rotate);
  const disableFlush = useUserStateStore((s) => s.disableFlush);
  const getRoomData = useUserStateStore((s) => s.getRoomData);

  return (
    <Box>
      {/* ① 选择节点（依赖账号：每个节点对应各自的隧道） */}
      {userWgInfo ? (
        <>
          <Text>
            ① 当前选择的是&ensp;
            <HighLight>{userWgInfo.node_alias}</HighLight>
            &ensp;节点
          </Text>

          <Button ml={4} onClick={setNodeListModal} size="sm">
            点击切换节点
          </Button>
        </>
      ) : (
        <NeedLogin text="① 登录后才能选择节点，每个节点对应各自的隧道" />
      )}

      <Text>
        <Icon as={MdTipsAndUpdates} mr={2} />
        <HighLight fontSize="sm">
          如果切换了新节点，要来这导入新节点的隧道，每个节点有对应的隧道
        </HighLight>
      </Text>

      <Text>
        <Icon as={MdTipsAndUpdates} mr={2} />
        <HighLight fontSize="sm">
          不要导入他人分享的隧道，一人一隧道不能共用
        </HighLight>
      </Text>

      <DocDivider />

      {children}

      <DocDivider />

      {/* ⑤ 刷新确认 WG 连接（依赖账号：连接状态来自房间数据） */}
      {userWgInfo ? (
        <>
          <Text>
            ⑤ WG隧道打开后<HighLight>等5秒</HighLight>再点刷新
          </Text>

          <Flex align="center" mt={1} gap={2}>
            <Text
              fontSize={18}
              fontWeight="bold"
              color={getStatusColor(isOnline)}
            >
              &emsp;{isOnline ? "恭喜！WG已连接" : "WG尚未连接"}
            </Text>

            <Button
              bg="transparent"
              h={5}
              px={0}
              disabled={disableFlush}
              onClick={() => {
                getRoomData(false);
              }}
              color="brand.text"
            >
              <Text>刷新</Text>
              <Box animation={rotate ? `${spin} 1s linear infinite` : "none"}>
                <TbReload size={18} />
              </Box>
            </Button>
          </Flex>

          {isOnline === false && (
            <Text>
              &emsp;隧道打开了还是未连接
              <Button
                ml={1}
                variant="link"
                bg="transparent"
                color="brand.text"
                onClick={() => {
                  navigate("/offlineCheck");
                }}
              >
                点我排查
              </Button>
            </Text>
          )}
        </>
      ) : (
        <NeedLogin text="⑤ 登录后才能刷新查看 WG 连接状态" />
      )}

      <DocDivider />

      {/* ⑥ 网页关闭不影响联机 */}
      <Text>
        ⑥ 联机需要网页和WG客户端配合
        <br />
        网页负责：创建/加入房间
        <br />
        WG客户端负责：联机通信
        <br />
        <HighLight>两者可以不在一台设备上</HighLight>
        ，比如手机开网页、平板装WG联机
        <br />
        <HighLight>关闭网页不影响联机</HighLight>
      </Text>

      <DocDivider />

      <Text>
        现在请
        <Button
          mx={1}
          variant="link"
          bg="transparent"
          color="brand.text"
          onClick={() => {
            navigate("/room");
          }}
        >
          返回联机房间
        </Button>
        ，创建或加入房间，房间里有游戏联机教程
      </Text>
    </Box>
  );
};
