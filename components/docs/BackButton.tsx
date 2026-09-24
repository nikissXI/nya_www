import { Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/universal/button";
import { useUserStateStore } from "@/store/user-state";

export default function BackButton() {
  const navigate = useNavigate();
  const embed = useUserStateStore((s) => s.embed);

  return (
    // 移动端居中、桌面端靠左（原来 display="block" 会把 Center 的 flex 布局覆盖掉，两端实际都是靠左）
    <Flex
      mt={5}
      justify={{ base: "center", md: "flex-start" }}
      display={embed ? "none" : "flex"}
    >
      <Button
        size="sm"
        onClick={() => {
          navigate("/room");
        }}
      >
        返回联机房间
      </Button>
    </Flex>
  );
}
