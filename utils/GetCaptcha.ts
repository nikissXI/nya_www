import { useUserStateStore } from "@/store/user-state";
import { apiUrl } from "@/utils/api";
import { useCallback } from "react";

/** 生成验证码图片地址，t 参数用于绕过浏览器缓存 */
export const getCaptchaUrl = (uuid: string): string =>
  `${apiUrl}/getCaptcha?uuid=${uuid}&t=${Date.now()}`;

const useCaptcha = () => {
  // 只订阅 uuid，避免其它状态变化时重建回调
  const uuid = useUserStateStore((state) => state.uuid);

  const fetchCaptcha = useCallback(() => getCaptchaUrl(uuid), [uuid]);

  return { fetchCaptcha };
};

export default useCaptcha;
