// sign in:

var index = 0;

module.exports = {
  'GET /signin': async(ctx, next) => {
    ctx.render('signin.html');
  },

  'POST /signin': async(ctx, next) => {
    let userName = ctx.request.body.username;
    let password = ctx.request.body.password;
    let user = {
      username: userName,
      password: password,
    };
    let value = Buffer.from(JSON.stringify(user)).toString('base64');
    console.log(`Set cookie value: ${value}`);
    ctx.cookies.set('user', value);
    ctx.response.redirect('/');
  },

  'GET /signout': async(ctx, next) => {
    ctx.cookies.set('user', '');
    ctx.response.redirect('/signin');
  }
};
