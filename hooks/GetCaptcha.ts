"use client";

import { useUserStateStore } from "@/store/user-state";
import { useCallback } from "react";

const useCaptcha = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const { uuid } = useUserStateStore();
  const fetchCaptcha = useCallback(async () => {
    const resp = await fetch(`${apiUrl}/getCaptcha?uuid=${uuid}`);
    if (resp.ok) {
      const blob = await resp.blob(); // 获取 Blob 对象
      return URL.createObjectURL(blob); // 返回图片地址
    } else {
      throw new Error("拉取图片验证码失败"); // 错误处理
    }
  }, [uuid]);

  return { fetchCaptcha };
};

export default useCaptcha;
