"use client";

import { openToast } from "@/components/universal/toast";
import { useUserStateStore } from "@/store/user-state";
import { useCallback } from "react";

const useCaptcha = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const { uuid } = useUserStateStore();

  const fetchCaptcha = useCallback(async () => {
    return `${apiUrl}/getCaptcha?uuid=${uuid}&t=${Date.now()}`;
    // const resp = await fetch(`${apiUrl}/getCaptcha?uuid=${uuid}`);
    // if (resp.ok) {
    //   const blob = await resp.blob(); // 获取 Blob 对象
    //   return URL.createObjectURL(blob); // 返回图片地址
    // } else {
    //   openToast({ content: "验证码加载失败，点击重试", status: "error" });
    //   throw new Error("拉取图片验证码失败"); // 错误处理
    // }
  }, [uuid, apiUrl]);

  return { fetchCaptcha };
};

export default useCaptcha;
