module.exports={
  appPort: 8080,
  mongodb: 'mongodb://127.0.0.1:27017/double8',
  redisPort: 6379,
  redisDb: '127.0.0.1',
  allowSite: ['http://127.0.0.1:3000','http://127.0.0.1:8080'],
  maxBytes: 5000,
  secret: 'hahaha',
  expire: 8*60*60 // 秒为单位
}