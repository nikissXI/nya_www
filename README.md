这是一个使用 Vite、React 和 React Router 构建的纯前端联机平台。

## 开始开发

```bash
pnpm dev
```

打开 http://localhost:3000 查看页面。

生产构建和预览：

```bash
pnpm build
pnpm start
```

## 环境变量

API 地址使用 Vite 的公开环境变量：

```env
VITE_API_URL=https://nyaapi.nikiss.top
```

部署时需要为 SPA 配置 fallback，将未知路径回退到 `index.html`，这样直接访问 `/room` 和 `/docs/...` 才能正常加载。
