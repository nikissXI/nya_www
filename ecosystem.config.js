module.exports = {
  apps: [{
    name: 'nya-www',
    
    // ===== 关键：指向 standalone 的入口 =====
    script: './.next/standalone/server.js',
    
    // ===== 集群模式配置 =====
    instances: 2,                // 启动 2 个进程（根据 CPU 核心数调整）
    exec_mode: 'cluster',        // 集群模式
    
    // ===== 零停机核心配置 =====
    wait_ready: true,            // 等待 'ready' 信号
    listen_timeout: 10000,       // 10 秒内没收到 ready 就认为失败
    kill_timeout: 5000,          // 强制杀死前等待 5 秒
    
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
    
    // ===== 其他 =====
    watch: false,                // 生产环境千万别开
    instance_var: 'INSTANCE_ID',
  }]
};