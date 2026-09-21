import { Center } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/universal/button";
import { useUserStateStore } from "@/store/user-state";

export default function BackButton() {
  const navigate = useNavigate();
  const { inApp } = useUserStateStore();

  return (
    <Center mt={5} display={inApp ? "none" : "block"}>
      <Button
        size="sm"
        onClick={() => {
          navigate("/room");
        }}
      >
        返回联机房间
      </Button>
    </Center>
  );
}
