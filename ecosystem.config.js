module.exports = {
  apps: [{
    name: 'my-ai-assistant',
    script: 'npm',
    args: 'start',
    env: {
      PORT: 3001,
      NODE_ENV: 'production'
    },
    instances: 'max',
    exec_mode: 'cluster',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G'
  }]
}; 