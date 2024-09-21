import hash from "hash.js";

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

export function validateUsername(username: string): boolean {
  // 正则表达式解释：
  // ^: 字符串开始
  // [\u4e00-\u9fa5a-zA-Z0-9-_]{1,10} : 允许中文字符、大小写字母、数字、- 和 _，长度在 1 到 10 个字符
  // $: 字符串结束
  const usernameRegex = /^[\u4e00-\u9fa5a-zA-Z0-9-_]{1,10}$/;

  return usernameRegex.test(username);
}

export function validateTel(tel: string): boolean {
  const phoneRegex = /^[1][3-9][0-9]{9}$/; // 中国大陆手机号正则
  return phoneRegex.test(tel);
}
