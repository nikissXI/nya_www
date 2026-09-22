import { useUserStateStore } from "@/store/user-state";
import { api } from "@/utils/endpoints";
import { useCallback } from "react";

const useCaptcha = () => {
  // 只订阅 uuid，避免其它状态变化时重建回调
  const uuid = useUserStateStore((state) => state.uuid);

  const fetchCaptcha = useCallback(() => api.captchaUrl(uuid), [uuid]);

  return { fetchCaptcha };
};

export default useCaptcha;
