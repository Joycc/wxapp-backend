const express = require('express');
const session = require('wafer-node-session');
const MongoStore = require('connect-mongo')(session);
const bodyParser = require('body-parser');

const config = require('./configs');

var app = express()

app.use(bodyParser.json());

app.use(session({
    // 小程序 appId
    appId: config.appId,
    // 小程序 appSecret
    appSecret: config.appSecret,

    // 登录地址
    loginPath: '/login',

    // 会话存储
    store: new MongoStore({
    url: `mongodb://${config.mongoUser}:${config.mongoPass}@${config.mongoHost}:${config.mongoPort}/${config.mongoDb}`
    })
}));

app.use('/me', function(req, res, next) {
    if (req.session) {
        // 从会话获取用户信息
        res.json(req.session.userInfo);
    } else {
        res.json({ nobody: true });
    }
})

app.get('/', function(req, res){
    res.send('hello')
})

app.post('/vote', function(req, res){
    res.send('ok')
})

app.get('/vote', function(req, res){
    //二进制每一位代表一个人
    res.json({
        'voted': 0,
        'votedHero': 2
    })
})

app.get('/score', function(req, res){
    res.json({'score':
        {0: 20,
         1: 30,
         2: 1455},
    }
    )
})

var server = app.listen(8080, function () {
  var host = '127.0.0.1'
  var port = config.serverPort
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
})
