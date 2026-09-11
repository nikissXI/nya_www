import { Center } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/universal/button";

export default function BackButton() {
  const navigate = useNavigate();
  return (
    <Center mt={5}>
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
