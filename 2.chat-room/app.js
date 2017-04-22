/**!
 *
 */

const Koa = require('koa');
const app = new Koa();

const url = require('url');

const WebSocket = require('ws');
const WebSocketServer = WebSocket.Server;

const Cookies = require('cookies');

const bodyParser = require('koa-bodyparser');

const controller = require('./controller');

const templating = require('./templating');

const Sequelize = require('sequelize');
const model = require('./model');

let User = model.User;
let Msg = model.Message;

// for create table use
// model.sync();

// (async() => {
//   await User.create({
//     name: 'jogne',
//     age: 26,
//     pwd: 'hiJonge'
//   });
//   console.log(JSON.stringify(await User.findAll()));
// })();



// log request URL:
app.use(async(ctx, next) => {
  console.log(`Process ${ctx.request.method} ${ctx.request.url} ...`);
  await next();
});

// parse user from cookie:
app.use(async(ctx, next) => {
  ctx.state = await parseUser(ctx.cookies.get('user') || '');
  console.log("ctx.state=", ctx.state);
  await next();
});

// static file support:
let staticFiles = require('./static-files');
app.use(staticFiles('/static/', __dirname + '/static'));

// parse request body:
app.use(bodyParser());

// add nunjucks as view:
app.use(templating('views', {
  noCache: true,
  watch: true
}));

// add controller middleware:
app.use(controller());


let server = app.listen(3000);

async function parseUser(obj) {
  if (!obj) {
    return;
  }
  console.log('try parse: ' + obj);
  let s = '';
  if (typeof obj === 'string') {
    s = obj;
  } else if (obj.headers) {
    let cookies = new Cookies(obj, null);
    s = cookies.get('user');
  }
  if (s) {
    try {
      let user = JSON.parse(Buffer.from(s, 'base64').toString());
      console.log(`User: ${user.username}, Password: ${user.password}`);
      let dbUsers = await User.findAll({
        where: {
          username: user.username
        },
        limit: 1
      });

      // console.log("dbUsers:", dbUsers);
      if (dbUsers === undefined || dbUsers.length === 0) {
        console.log("not a exists user.", dbUsers);
        return {
          signinFailed: true
        };
      } else {
        if (dbUsers[0].password === user.password) {
          console.log("legal user, signed in.");
          user.nickname = dbUsers[0].nickname;
          user.avatar = dbUsers[0].avatar;
          return {
            user: user
          }
        } else {
          console.log("illegal user.");
          return {
            signinFailed: true
          };
        }
      }
    } catch (e) {
      console.warn('parseUser error:', e);
      return {
        signinFailed: true
      };
      // ignore
    }
  }
}

// WebSocket configure
async function createWebSocketServer(server, onConnection, onMessage, onClose, onError) {
  let wss = new WebSocketServer({
    server: server
  });
  wss.broadcast = function broadcast(data, selfname) {
    wss.clients.forEach(function each(client) {
      console.log("client.user:",client.user);
      data.username = client.user.user.username;
      if (client.readyState === WebSocket.OPEN && selfname != client.user.user.username) {
        client.send(data);
      }
    });
  };
  onConnection = onConnection || function() {
    console.log('[WebSocket] connected.');
  };
  onMessage = onMessage || function(msg) {
    console.log('[WebSocket] message received: ' + msg);
  };
  onClose = onClose || function(code, message) {
    console.log(`[WebSocket] closed: ${code} - ${message}`);
  };
  onError = onError || function(err) {
    console.log('[WebSocket] error: ' + err);
  };
  wss.on('connection', async function(ws) {
    let location = url.parse(ws.upgradeReq.url, true);
    console.log('[WebSocketServer] connection: ' + location.href);
    ws.on('message', onMessage);
    ws.on('close', onClose);
    ws.on('error', onError);
    if (location.pathname !== '/ws/chat') {
      // close ws:
      ws.close(4000, 'Invalid URL');
    }
    // check user:
    let user = await parseUser(ws.upgradeReq);
    if (!user) {
      ws.close(4001, 'Invalid user');
    }
    ws.user = user;
    ws.wss = wss;
    console.log("deal with coonection");
    onConnection.apply(ws);
  });
  console.log('WebSocketServer was attached.');
  return wss;
}

var messageIndex = 0;

function createMessage(type, user, data) {
  return JSON.stringify({
    username: user.username,
    type: type,
    data: data
  });
}

async function onConnect() {
  let user = this.user.user;
  delete user.password;
  console.log('connect user:', user);
  // broadcast this join event
  let msg = createMessage('join', user, user);
  this.wss.broadcast(msg,user.username);

  try {
    await User.update({
      online: 1,
    }, {
      where: {
        username: user.username
      }
    });
    let olUsers = await User.findAll({
      attributes: ['username', 'nickname', 'avatar'],
      where: {
        online: 1
      }
    });
    // console.log("users: ", olUsers)
    olUsers.forEach(x => {
      delete x.id;
      delete x.password;
    });
    this.send(createMessage('list', user, olUsers));

  } catch (e) {
    console.error("query get a error", e);
  } finally {

  }

}

function onMessage(message) {
  console.log("get a msg: ",message);
  if (message && message.trim()) {
    let msg = createMessage('say', this.user.user, message.trim());
    this.wss.broadcast(msg);
    console.log("will send msg:",msg);
  }
}

function onClose() {
  let user = this.user.user;
  let msg = createMessage('left', user, `${user.name} is left.`);
  this.wss.broadcast(msg);
  User.update({
    online: 0,
  }, {
    where: {
      username: user.username
    }
  });
}

app.wss = createWebSocketServer(server, onConnect, onMessage, onClose);

console.log('app started at port 3000...');
