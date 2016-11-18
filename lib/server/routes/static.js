const config = require('../../config');
const spaStatic = require('spa-static/lib/middleware')({
  staticDir: 'dist',
});

const TEAMBITION_OAUTH2 = config.get('TEAMBITION_OAUTH2');

module.exports = function* (next) {
  if (!this.user.id) {
    this.redirect(TEAMBITION_OAUTH2);
    return;
  }
  next = spaStatic.call(this, next);
  yield* next;
};
