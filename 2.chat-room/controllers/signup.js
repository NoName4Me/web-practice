// sign up:
const Sequelize = require('sequelize');
const model = require('../model');
let User = model.User;
var index = 0;

module.exports = {
  'GET /signup': async(ctx, next) => {
    let firstNames = '张王李赵刘吴魏钱何白';
    let lastNames = '一二三四五六七八九十';
    let nickName = firstNames[Math.floor(Math.random() * firstNames.length)] + lastNames[Math.floor(Math.random() * lastNames.length)];
    ctx.render('signup.html', {
      nickname: nickName
    });
  },

  'POST /signup': async(ctx, next) => {
    let userName = ctx.request.body.username;
    let nickName = ctx.request.body.nickname;
    let password = ctx.request.body.password;
    let user = {
      username: userName,
      nickname: nickName,
      password: password,
    };

    try {
      await User.create({
        username: userName,
        nickname: nickName,
        password: password,
        avatar: `https://api.adorable.io/avatars/64/${Math.floor(Math.random(16)*100)}`
      });
    } catch (e) {
      console.error("create user error: ", e);
      ctx.state.signupFailed = true;
      ctx.render('signup.html', {
        signupFailed: ctx.state.signupFailed,
        nickname: nickName
      });
      return;
    } finally {

    }

    let value = Buffer.from(JSON.stringify(user)).toString('base64');
    console.log(`Set cookie value: ${value}`);
    ctx.cookies.set('user', value);
    ctx.response.redirect('/');
  }
};
