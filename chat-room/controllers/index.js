// index:

module.exports = {
  'GET /': async(ctx, next) => {
    if (!ctx.state) {
      ctx.response.redirect('/signin');
      return;
    }
    let user = ctx.state.user;

    if (user) {
      ctx.render('room.html');
    } else {
      if (ctx.state.signinFailed === true) {
        ctx.response.redirect('/signin', {
          signinFailed: ctx.state.signinFailed
        });
      } else {
        ctx.response.redirect('/signin');
      }

    }
  }
};
