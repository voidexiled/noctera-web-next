module.exports = {
  apps : [{
    script: 'pnpm start'
  }],

  deploy : {
    production : {
	key: 'key.pem',
      user : 'noctera_global',
      host : '34.16.96.148',
      ref  : 'origin/main',
      repo : 'git@github.com:voidexiled/noctera-web-next.git',
      path : '/home/noctera_user_new',
      'pre-deploy-local': '',
      'post-deploy' : 'pnpm install && pnpm build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
	'ssh_options': 'ForwardAgent=yes'
    }
  }
};
