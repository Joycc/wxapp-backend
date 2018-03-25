const express = require('express');
const session = require('wafer-node-session');
const MongoStore = require('connect-mongo')(session);
const bodyParser = require('body-parser');
const config = require('./configs');

var MongoClient = require('mongodb').MongoClient,
      test = require('assert');

const dburl = 'mongodb://'+config.mongoUser+':'+config.mongoPass+'@'+config.mongoHost+':'+config.mongoPort+'/'+config.mongoDb

function insertDB(docs, res){
    MongoClient.connect(dburl, function(err, db) {
        // Get a collection
        var collection = db.collection('voted');
        collection.findOne({'user':docs.user}).then(function(item) {
            if (null == item){
                collection.insertOne({'user': docs.user, 'voted': 1, 'votedHero': Math.pow(2, docs.hero)})
                var heroCollection = db.collection('hero');
                heroCollection.findOne({'hero':docs.hero}).then(function(heros) {
                test.equal(docs.hero, heros.hero)
                heroCollection.updateOne({'hero': docs.hero}, {$set:{'score': heros.score+1}})
                res.send('ok')
                db.close();
                });

            }
            else{
                if (item.votedHero >> docs.hero & 1) {
                    db.close()
                    res.send('bad')
                }
                else {
                    collection.updateOne({'user': docs.user}, {$set:{'voted': item.voted+1, 'votedHero':item.votedHero + Math.pow(2, docs.hero)}})
                    var heroCollection = db.collection('hero');
                    heroCollection.findOne({'hero':docs.hero}).then(function(heros) {
                    test.equal(docs.hero, heros.hero)
                    heroCollection.updateOne({'hero': docs.hero}, {$set:{'score': heros.score+1}})
                    res.send('ok')
                    db.close();
                    });
                }
            }
            });
        })
}

function getScore(res){
    MongoClient.connect(dburl, function(err, db) {
    // Get a collection
    var collection = db.collection('hero');
    collection.find().toArray(function(err, docs) {
        test.equal(null, err)
        db.close();
        res.json({ 'score': docs});
        });
    })
}

function getVoted(user, res){
    MongoClient.connect(dburl, function(err, db) {
    // Get a collection
    var collection = db.collection('voted');
    collection.findOne({'user': user}).then(function(docs) {
        db.close();
        res.json(docs)
        });
    })
}

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

app.post('/vote', function(req, res){
    insertDB(req.body, res)
})

app.get('/vote', function(req, res){
    //二进制每一位代表一个人
    getVoted(req.query.user, res)
})

app.get('/score', function(req, res){
    getScore(res)
})

var server = app.listen(8080, function () {
  var host = '127.0.0.1'
  var port = config.serverPort
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
})
