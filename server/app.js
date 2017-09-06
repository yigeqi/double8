const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
// const jwt = require('express-jwt')
 const jwt = require('jsonwebtoken')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
//本地文件
var redisClient = require('./db/redis.js')
const users = require('./controllers/users.js')

// 连接数据库
mongoose.connect('mongodb://192.168.27.99:27017/double8',{useMongoClient:true})
const db = mongoose.connection
db.on('error', ()=>{console.log('connection error.')})
db.once('open', ()=>{console.log('db opened.')})

const app = express()
const router = express.Router()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
// app.use(jwt({secret:'hahaha'}).unless({path:['/about',/\/static\/.*/,'/login','/register']}))
app.use(methodOverride())

app.use(express.static(path.resolve(__dirname, '..', 'build')))

app.use(router)
app.use((req,res,next)=>{
  if (['/about','/login','/register'].indexOf(req.path)!==-1 || /\/static\/.*/.test(req.path)) {
    return next()
  }
  //此处验证token： jwt.verify()
  var token = req.headers.authorization
  if (token) {
    jwt.verify(token, 'hahaha', (err, decoded) => {
      if (err) {
        return res.json({success: false, message: 'failed to authenticate token.'+err.message})
      } else {
        // 如果user.id存在在redis里面，表示验证通过
        redisClient.get(decoded.id, (err,reply)=> {
          if (err) {
            return res.json({success: false, message: 'get token from redis failed:'+err.message})
          } else if (reply===null) {
            return res.json({success: false, message: 'token is missing in redis.'})
          } else if (token !== reply) {
            return res.json({success: false, message: 'token not right.'})
          } else {
            req.user = {id: decoded.id,reply}
            next()
          }
        })
      }
    })
  } else {
    return res.status(403).send({success:false,message:'no token provided'})
  }
})
app.post("/login", users.login);
app.post("/register", users.register);
app.get("/logout", users.logout);
app.get('/justtest', (req,res) => {
  console.log(req.user)
  res.sendStatus(200)
})
app.get('/about', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'))
})


app.listen(process.env.PORT || 8080, () => {
  console.log(`app is listening on port ${process.env.PORT || 8080}.`)
})