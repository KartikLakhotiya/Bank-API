export const apps = [{
  name: "Bank-API",
  script: 'server.js',
  watch: '.'
}, {
  script: './service-worker/',
  watch: ['./service-worker']
}];
export const deploy = {
  production: {
    user: 'SSH_USERNAME',
    host: 'SSH_HOSTMACHINE',
    ref: 'origin/master',
    repo: 'GIT_REPOSITORY',
    path: 'DESTINATION_PATH',
    'pre-deploy-local': '',
    'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
    'pre-setup': ''
  }
};
