const express = require('express')
const path = require('path')
const querystring = require('querystring');
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
// mongoose.createConnection(config.mongodb,{useMongoClient:true})
// .then(()=>{console.log('db connection ok')},(err)=>{console.log('db connection error,'+err.stack)})
// .catch(err=>console.error('db connection error,'+err))
//上面这方法not work，没有真正连接成功，导致userModal的findOne等方法无法执行
mongoose.connect(config.mongodb,{useMongoClient:true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log('DB connection opened');
});

const app = express()
app.use(methodOverride())
app.use(express.static(path.resolve(__dirname, '..', 'build')))

const router = express.Router()
app.use(router)

//通过cookie中的token和redis验证用户身份
const AuthHandler = (req,res,next) => {
  // 为了允许跨域，server端：'Access-Control-Allow-Origin','some domain',Access-Control-Allow-Credentials',true
  // client端： withCredentials:true
  // 跨域发送Cookie要求Access-Control-Allow-Origin不允许使用通配符*，而且只能指定单一域名,
  // 如果需要设置多个域名，可以在判断req.headers.origin在允许域名内，再设置req.header('Access-Control-Allow-Origin',req.headers.origin)
  res.header('Access-Control-Allow-Origin',req.headers.origin)
  res.header('Access-Control-Allow-Credentials',true)
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With')
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')
  // 取代body-parser,因为这里req.body的undefined... next()里无法处理
  const ct = req.headers['content-type'] || ''
  const contentType = ct.split(';')[0]
  try {
    if (contentType === 'application/json') {
      req.body = JSON.parse(req.rawBody)
    } else if(contentType === 'application/x-www-form-urlencoded') {
      req.body = querystring.parse(req.rawBody)
    } else if (contentType === 'application/xml') {
      // to be done with 'xml2js' library
    } else if (contentType === 'multipart/form-data') {
      // to be done with 'Formidable'
    }
  } catch(e) {
    return res.status(500).send({success:false,message:`Invalid parse,${e.message}`})
  }
  if (['/','/login','/register'].indexOf(req.path)!==-1 || /\/static\/.*/.test(req.path)) {
    return next()
  }
  //根据cookie中的token,解密后取到对应的id,此id就是user._id，就知道是哪个用户提交的请求了
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
  jwt.verify(token, config.secret, (err, decoded) => {
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
            redisClient.set(decoded.id, token, 'EX', 1)
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
}
//防止CSRF以及请求提交的内容过大
app.use((req,res,next)=>{
  console.log(req.headers.origin)
  if (config.allowSite.indexOf(req.headers.origin)===-1) {
    return res.status(401).send({success: false, message: 'This is a CSRF.'})
  }
  var received = 0
  var buffers = []
  var len = req.headers['content-length'] ? parseInt(req.headers['content-length'],10) : null
  if (len && len > config.maxBytes) {
    return res.status(413).send({success: false, message: 'request body too large.'})
  }
  req.on('data',(chunk)=>{
    received+=chunk.length
    if (received > config.maxBytes) {
      res.status(413).send({success: false, message: 'request body too large.'})
      //停止接收数据
      req.destroy()
    } else {
      buffers.push(chunk)
    }
  })
  //注,对于复杂post请求，因为会有两个请求，第一次options,第二次post，所以会先触发end(received=0),然后是第二次的data和end事件
  req.on('end',()=>{
    req.rawBody = Buffer.concat(buffers).toString()
    received <= config.maxBytes && AuthHandler(req,res,next)
  })
})
//req.on('data')要放在app.use(bodyParser....)前面会才能触发事件，
//因为http解析报头结束后，解析报文内容的时候就会触发data事件
// app.use(bodyParser.urlencoded({ extended: true }))
// app.use(bodyParser.json())

app.post("/login", users.login);
app.post("/register", users.register);
app.get("/logout", users.logout);
app.get('/justtest', (req,res) => {
  res.status(200).send({username:'myusername'})
})
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'))
})

app.listen(config.appPort, () => {
  console.log(`app is listening on port ${config.appPort}.`)
})