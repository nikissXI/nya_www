import hash from "hash.js";
import dayjs from "dayjs";
import { openToast } from "@/components/universal/toast";
import {
  RiSignalCellular3Fill,
  RiSignalCellular2Fill,
  RiSignalCellular1Fill,
} from "react-icons/ri";

export function getHash(contentStr: string): string {
  return hash.sha256().update(contentStr).digest("hex");
}

export function validatePassword(password: string): boolean {
  // 检查密码长度
  if (password.length < 8) {
    return false;
  }
  // 检查是否包含数字
  const hasNumber = /[0-9]/.test(password);
  // 检查是否包含字母
  const hasCase = /[A-Za-z]/.test(password);
  // 返回最终结果
  return hasNumber && hasCase;
}

export function validateTel(tel: string): boolean {
  const phoneRegex = /^[1][3-9][0-9]{9}$/; // 中国大陆手机号正则
  return phoneRegex.test(tel);
}

export function isInteger(value: string): boolean {
  const regex = /^[0-9]+$/; // 仅允许 0 到 9 的数字
  return regex.test(value);
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const copyText = async (text: string) => {
  try {
    if (navigator.clipboard && navigator.permissions) {
      await navigator.clipboard.writeText(text);
      openToast({ content: "已复制", status: "info" });
    } else {
      throw new Error("不支持自动复制");
    }
  } catch (err) {}
};

const GOOD = "#00e63a";
const SOSO = "#ffb12c";
const BAD = "#ff3737";

export const getNetColor = (net: number) => {
  if (net <= 60) return GOOD;
  if (net <= 85) return SOSO;
  return BAD;
};

export const getNetText = (net: number) => {
  if (net <= 60) return "空闲";
  if (net <= 85) return "一般";
  return "拥挤";
};

export const getDelayColor = (delay: number) => {
  if (delay < 60) return GOOD;
  if (delay < 120) return SOSO;
  return BAD;
};

export const getDelayIcon = (delay: number) => {
  if (delay < 60) return <RiSignalCellular3Fill size={20} />;
  if (delay < 120) return <RiSignalCellular2Fill size={20} />;
  return <RiSignalCellular1Fill size={20} />;
};

export const getStatusColor = (online: boolean) => {
  if (online) return GOOD;
  return BAD;
};
