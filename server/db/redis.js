const config = require('../config')
const redis = require('redis')

const redisClient = redis.createClient(config.redisPort,config.redisDb,{}) //redisDb不是localhost时need set password
redisClient.on('error', (error) => {
  console.log('redis error.', error)
})
redisClient.on('ready', (res) => {
  console.log('redis ready.')
})

module.exports = redisClient