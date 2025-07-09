"use client";

import { useUserStateStore } from "@/store/user-state";
import { useCallback } from "react";

const useCaptcha = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const { uuid } = useUserStateStore();

  const fetchCaptcha = useCallback(async () => {
    return `${apiUrl}/getCaptcha?uuid=${uuid}&t=${Date.now()}`;
  }, [uuid, apiUrl]);

  return { fetchCaptcha };
};

export default useCaptcha;
