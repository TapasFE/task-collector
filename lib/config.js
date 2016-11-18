const nconf = require('nconf');

nconf
.file({
  file: 'config.yml',
  format: require('nconf-yaml'),
})
.env()
.defaults({
  NODE_ENV: 'development',
  HOST: '',
  PORT: 4333,
  TOKEN_KEY: '__token',
});

nconf.required([
  'SECRET_KEY',
  'TEAMBITION_CLIENT_ID',
  'TEAMBITION_CLIENT_SECRET',
  'CALLBACK_URL',
]);

nconf.set('TEAMBITION_OAUTH2', `https://account.teambition.com/oauth2/authorize?client_id=${encodeURIComponent(nconf.get('TEAMBITION_CLIENT_ID'))}&redirect_uri=${encodeURIComponent(nconf.get('CALLBACK_URL'))}`);

module.exports = nconf;
