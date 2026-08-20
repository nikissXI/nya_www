import { useUserStateStore } from "@/store/user-state";
import { apiUrl } from "@/utils/api";
import { useCallback } from "react";

const useCaptcha = () => {
  const { uuid } = useUserStateStore();

  const fetchCaptcha = useCallback(async () => {
    return `${apiUrl}/getCaptcha?uuid=${uuid}&t=${Date.now()}`;
  }, [uuid, apiUrl]);

  return { fetchCaptcha };
};

export default useCaptcha;
