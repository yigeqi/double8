const redis = require('redis')
// const redisClient = redis.createClient(6379,'192.168.27.99',{})---need set password
const redisClient = redis.createClient(6379,'127.0.0.1',{})
redisClient.on('error', (error) => {
  console.log('redis error.', error)
})
redisClient.on('ready', (res) => {
  console.log('redis ready.')
})

module.exports = redisClient