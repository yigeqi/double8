const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
 const jwt = require('jsonwebtoken')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
mongoose.Promise = global.Promise;
//本地文件
const redisClient = require('./db/redis.js')
const config = require('./config')
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
app.use(methodOverride())

app.use(express.static(path.resolve(__dirname, '..', 'build')))

app.use(router)
app.use((req,res,next)=>{
  if (req.headers.origin !== 'http://192.168.27.99:3000') {
    return res.status(401).send({success: false, message: 'This is a CSRF.'})
  }
  // 为了允许跨域，server端：'Access-Control-Allow-Origin','some domain',Access-Control-Allow-Credentials',true
  // client端： withCredentials:true
  // 安全策略，不允许'Access-Control-Allow-Origin','*'同时credentials:true
  // 如果需要设置多个域名，可以在判断req.headers.origin在允许域名内，在
  // 设置req.header('Access-Control-Allow-Origin',req.headers.origin)
  res.header('Access-Control-Allow-Origin','http://192.168.27.99:3000')
  res.header('Access-Control-Allow-Credentials',true)
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With')
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')
  if (['/','/login','/register'].indexOf(req.path)!==-1 || /\/static\/.*/.test(req.path)) {
    return next()
  }
  //根据cookie中的token,解密后取到对应的id,此id就是user_id，就知道是哪个用户提交的请求了
  //取cookie中的token
  var token = ''
  const cookie = req.headers.cookie
  console.log(req.path,cookie)
  if (!cookie) {
    return res.status(401).send({success:false,message:'no cookie provided'})
  }
  const list = cookie.split(';')
  for (var i=0;i<list.length;i++) {
    var pair = list[i].split('=')
    if (pair[0].trim()==='token') {
      token = pair[1]
      break
    }
  }
  if (!token) {
    return res.status(401).send({success:false,message:'no token provided'})
  }
  //通过jwt.verify()验证token是否符合规则
  jwt.verify(token, 'hahaha', (err, decoded) => {
    if (err) {
      return res.status(401).send({success: false, message: 'failed to authenticate token.'+err.message})
    } else {
      // 如果token存在在redis里面，表示验证通过
      redisClient.get(decoded.id, (err,reply)=> {
        if (err) {
          return res.status(401).send({success: false, message: 'get token from redis failed:'+err.message})
        } else if (reply===null) {
          return res.status(401).send({success: false, message: 'token is missing in redis.'})
        } else if (token !== reply) {
          return res.status(401).send({success: false, message: 'token not right.'})
        } else {
          if (req.path==='/logout') {
            redisClient.set(decoded.id, token, 'EX', 0)
            res.clearCookie('token',{path:'/'})
            next()
          } else {
            //更新有效期
            redisClient.set(decoded.id, token, 'EX', config.expire)
            res.cookie('token',token,{path:'/',maxAge:config.expire*1000,httpOnly:true})
            //把用户id存入req给next()用
            req.userId = decoded.id
            next()
          }
        }
      })
    }
  })
})
app.post("/login", users.login);
app.post("/register", users.register);
app.get("/logout", users.logout);
app.get('/justtest', (req,res) => {
  // res.sendStatus(200)
  res.status(200).send({username:'myusername'})
})
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'))
})


app.listen(process.env.PORT || 8080, () => {
  console.log(`app is listening on port ${process.env.PORT || 8080}.`)
})