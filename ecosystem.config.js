module.exports = {
  apps: [{
    name: 'nya-www',
    
    // ===== 关键：指向 standalone 的入口 =====
    // 线上服务器跑在 release/（由 deploy.sh 组装 .next/standalone + 静态资源后原子切换），
    // 这样 next build 清空 .next 时不会影响正在运行的进程。
    script: './release/server.js',
    cwd: __dirname,              // 固定工作目录，避免从其他目录启动时路径解析错误
    
    // ===== 集群模式配置 =====
    instances: 2,                // 启动 2 个进程（根据 CPU 核心数调整）
    exec_mode: 'cluster',        // 集群模式
    
    // ===== 零停机核心配置 =====
    // 零停机原理：cluster 模式下 `pm2 reload` 会逐个实例滚动重载（先起新再杀旧），
    // 由 pm2 自动完成，无需手动指定实例序号。
    // wait_ready 保持注释：standalone server.js 不会向 pm2 发送 'ready' 信号。
    // wait_ready: true,            // 等待 'ready' 信号
    listen_timeout: 10000,       // （仅 wait_ready 开启时生效）10 秒内未收到 ready 视为失败
    kill_timeout: 5000,          // 优雅关停：强制杀死前等待 5 秒
    
    // ===== 环境变量 =====
    env: {
      NODE_ENV: 'production',
      PORT: 3000,                // 服务端口
      // 如果有其他环境变量，在这里加
      // DATABASE_URL: 'xxx',
      // REDIS_URL: 'xxx',
    },
    
    // ===== 日志配置 =====
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    merge_logs: true,
    time: true,
    
    // ===== 自动重启策略 =====
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s',
    max_memory_restart: '500M',  // 内存超限自动重启，防止内存泄漏拖垮服务
    
    // ===== 其他 =====
    watch: false,                // 生产环境千万别开
    instance_var: 'INSTANCE_ID',
  }]
};