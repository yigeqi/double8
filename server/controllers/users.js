const UserModel = require('../db/userModel')
const jwt = require('jsonwebtoken')
var redisClient = require('../db/redis.js')

exports.login = (req, res) => {
  const username = req.body.username
  const password = req.body.password
  UserModel.findOne({username,password}, (err, user) => {
    if (err) {
      console.log(err)
      return res.sendStatus(500)
    }
    if (user) {
      const token = jwt.sign({id: username}, 'hahaha', {expiresIn: 24*60*60})
      // 有交互时要记得更新这个过期时间
      redisClient.set(user.username, token, 'EX', 24*60*60)
      return res.json({token,user})
    } else {
      return res.json({success:false,message:'user not exist or password not right.'})
    }
  })
}
exports.register = (req, res) => {
  const username = req.body.username
  const password = req.body.password
  UserModel.findOne({username}, (err, user) => {
    if (err) {
      console.log(err)
      return res.sendStatus(500)
    }
    if (user) {
      return res.json({success:false,message:'user already exist.'})
    } else {
      var newuser = new UserModel({username,password})
      newuser.save(err => {
        if (err) {
          console.log(err)
          return res.sendStatus(500)
        }
        return res.sendStatus(200)
      })
    }
  })
}
exports.logout = (req, res) => {
  if (req.user) {
    redisClient.set(req.user.id, req.user.token, 'EX', 1)
    delete req.user;  
    return res.sendStatus(200);
  } else {
    return res.status(403).send({success:false,message:'no token provided'});
  }
}
