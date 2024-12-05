module.exports = {
  apps : [{
    script: 'pnpm start'
  }],

  deploy : {
    production: {
      user : 'noctera_user_new',
      host : '127.0.0.1',
      ref  : 'origin/main',
      repo : 'https://github.com/voidexiled/noctera-web-next.git',
      path : '/home/noctera_user_new',
      'pre-deploy-local': '',
      'post-deploy' : 'pnpm install && pnpm build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',

    }
  }
};
