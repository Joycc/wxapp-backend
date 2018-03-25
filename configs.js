module.exports = {
    serverPort: '8080',
    // 小程序 appId 和 appSecret
    // 请到 https://mp.weixin.qq.com 获取 AppID 和 AppSecret
    appId: 'wx2ca41333d7e7c352',
    appSecret: '29c6bf41665ffb4e7a971ce27410c1f5',

    // mongodb 连接配置，生产环境请使用更复杂的用户名密码
    mongoHost: '127.0.0.1',
    mongoPort: '27017',
    mongoUser: 'weapp',
    mongoPass: 'weapp-dev',
    mongoDb: 'weapp'
};
