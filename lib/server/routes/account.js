const fetch = require('node-fetch');
const Router = require('koa-router');
const {User} = require('../../models');
const config = require('../../config');

const TEAMBITION_CLIENT_ID = config.get('TEAMBITION_CLIENT_ID');
const TEAMBITION_CLIENT_SECRET = config.get('TEAMBITION_CLIENT_SECRET');
const TOKEN_KEY = config.get('TOKEN_KEY');
const ORGANIZATION_ID = config.get('ORGANIZATION_ID');

function getAccessToken(code) {
  return fetch('https://account.teambition.com/oauth2/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: TEAMBITION_CLIENT_ID,
      client_secret: TEAMBITION_CLIENT_SECRET,
      code,
      grant_type: 'code',
    }),
  })
  .then(res => res.json().then(data => {
    if (res.status > 300) throw {status: res.status, data};
    return data;
  }))
  .then(data => data.access_token);
}

function fetchAPI(token, path) {
  return fetch(`https://api.teambition.com/api${path}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `OAuth2 ${token}`,
    },
  })
  .then(res => res.json().then(data => {
    if (res.status > 300) throw {status: res.status, data};
    return data;
  }));
}

const router = new Router({
  prefix: '/account',
});

router
.get('/callback', function* (next) {
  const {code} = this.query;
  if (!code) {
    this.status = 400;
    return;
  }
  let userAttr;
  try {
    const accessToken = yield getAccessToken(code);
    const [me, teams] = yield [
      fetchAPI(accessToken, '/users/me'),
      fetchAPI(accessToken, '/organizations'),
    ];
    if (ORGANIZATION_ID && !teams.find(item => item._id === ORGANIZATION_ID)) {
      this.status = 401;
      return;
    }
    const {_id, email, name, avatarUrl} = me;
    userAttr = {
      openId: _id,
      email,
      name,
      avatar: avatarUrl,
    };
  } catch (e) {
    console.error(e);
    this.status = 500;
    return;
  }
  yield User.upsert(userAttr);
  const user = yield User.find({
    where: {openId: userAttr.openId},
  });
  this.cookies.set(TOKEN_KEY, new Buffer(JSON.stringify({
    id: user.get('id'),
  })).toString('base64'), {
    signed: true,
    expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
  });
  this.redirect('/');
})
.get('/logout', function* (next) {
  this.cookies.set(TOKEN_KEY, '', {expires: new Date(Date.now() - 24 * 60 * 60 * 1000)});
  this.redirect('/account/login');
})

module.exports = router.routes();
