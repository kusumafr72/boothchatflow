module.exports = {
  apps: [{
    name: 'my-ai-assistant',
    script: 'npm',
    args: 'start',
    env: {
      PORT: 3000,
      NODE_ENV: 'production'
    },
    instances: 1,
    autorestart: true,
    watch: false
  }]
}; 