module.exports={
  appPort: 8080,
  appUrl: 'http://127.0.0.1',
  mongodb: 'mongodb://127.0.0.1:27017/double8',
  redisPort: 6379,
  redisDb: '127.0.0.1',
  allowSite: ['http://127.0.0.1:3456'],
  maxBodySize: '2mb',
  secret: 'hahaha',
  expire: 8*60*60 // cookie和redis的过期时间，秒为单位
}