"user client";

export const GetConfUrl = (wgnum: number) => {
  const key = localStorage.getItem("key"); // 从 localStorage 获取 key
  const apiUrl = process.env.NEXT_PUBLIC_API_URL; // 从环境变量获取 API 地址

  if (key) {
    fetch(`${apiUrl}/downloadConf`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${key}`, // 将 key 放在请求头中
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const fileName = `${wgnum}.conf`; // 默认文件名
        return response.blob().then((blob) => ({ blob, fileName })); // 返回 blob 和文件名
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
        alert("登陆凭证失效，请刷新页面");
        console.error("Error downloading the file:", error);
      });
  } else {
    console.error("No key found in localStorage");
  }
};
