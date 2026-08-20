const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();

if (!configuredApiUrl) {
  throw new Error("缺少 VITE_API_URL 环境变量");
}

export const apiUrl = configuredApiUrl.replace(/\/+$/, "");