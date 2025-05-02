module.exports = {
  apps: [{
    name: 'my-ai-assistant',
    script: '/usr/bin/npm',
    args: 'run start',
    cwd: '/root/my-ai-assistant',
    env: {
      PORT: 3001,
      NODE_ENV: 'production'
    },
    instances: 1,
    autorestart: true,
    watch: false,
    exec_mode: 'fork'
  }]
}; 