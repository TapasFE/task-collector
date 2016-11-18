const config = require('../../config');

const TOKEN_KEY = config.get('TOKEN_KEY');

module.exports = function* (next) {
  let user;
  try {
    const cookie = this.cookies.get(TOKEN_KEY, {signed: true});
    user = cookie && JSON.parse(new Buffer(cookie, 'base64').toString());
  } catch (e) {
    // ignore invalid cookie
    console.error(e);
  }
  this.user = user || {};
  yield* next;
};
