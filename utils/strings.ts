import hash from "hash.js";
import dayjs from "dayjs";

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
  // 检查是否包含大写字母
  const hasUpperCase = /[A-Z]/.test(password);
  // 检查是否包含小写字母
  const hasLowerCase = /[a-z]/.test(password);
  // 返回最终结果
  return hasNumber && hasUpperCase && hasLowerCase;
}

export function validateTel(tel: string): boolean {
  const phoneRegex = /^[1][3-9][0-9]{9}$/; // 中国大陆手机号正则
  return phoneRegex.test(tel);
}

export function timestampToDateString(timestamp: number): string {
  return dayjs(timestamp * 1000).format("YYYY-MM-DD HH:mm:ss"); // 自定义格式
}

export async function copyToCilpboard(text: string) {
  if (navigator.clipboard && navigator.permissions) {
    await navigator.clipboard.writeText(text);
  } else {
    const textArea = document.createElement("textarea"); // 注意这里是 textarea 而不是 textArea
    textArea.value = text; // 使用 value 而不是 ariaValueText
    textArea.style.width = "0";
    textArea.style.position = "fixed";
    textArea.style.left = "-999px";
    textArea.style.top = "10px";
    textArea.setAttribute("readonly", "readonly");
    document.body.appendChild(textArea);
    textArea.select(); // 选择文本
    document.execCommand("copy"); // 复制文本
    document.body.removeChild(textArea); // 移除 textarea
  }
}
