"user client";

import { openToast } from "./toast";
import { getAuthToken } from "@/store/authKey";

export const GetConfUrl = (ip: string) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL; // 从环境变量获取 API 地址

  fetch(`${apiUrl}/downloadConf`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getAuthToken()}`, // 将 key 放在请求头中
    },
  })
    .then((resp) => {
      if (!resp.ok) {
        throw new Error("Network resp was not ok");
      }
      const fileName = `${ip}.conf`; // 默认文件名
      return resp.blob().then((blob) => ({ blob, fileName })); // 返回 blob 和文件名
    })
    .then(({ blob, fileName }) => {
      const url = window.URL.createObjectURL(blob); // 创建下载链接
      const a = document.createElement("a"); // 创建 a 标签
      a.href = url; // 设置 href 为 blob URL
      a.download = fileName; // 设置下载文件名为后端返回的文件名
      document.body.appendChild(a); // 将 a 标签添加到文档中
      a.click(); // 点击 a 标签触发下载
      a.remove(); // 移除 a 标签
      window.URL.revokeObjectURL(url); // 释放 blob URL
    })
    .catch((error) => {
      openToast({ content: "登陆凭证失效", status: "warning" });
      console.error("Error downloading the file:", error);
    });
};
