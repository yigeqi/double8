const UserModel = require('../db/userModel')
const jwt = require('jsonwebtoken')
var redisClient = require('../db/redis.js')

exports.login = (req, res) => {
  const username = req.body.username
  const password = req.body.password
  UserModel.findOne({username}, async (err, user) => {
    if (err) {
      console.log(err)
      return res.sendStatus(500)
    }
    if (user) {
      const isSame = await user.comparePassword(password, user.password)
      if (!isSame) {
        return res.json({success:false,message:'password not right'})
      }
      const user_id = user._id.toString()
      const token = jwt.sign({id: user_id}, 'hahaha', {expiresIn: 24*60*60})
      // 有交互时要记得更新这个过期时间
      redisClient.set(user_id, token, 'EX', 24*60*60)
      // 把token存在cookie里发给客户端,设置cookie的有效期为1天,
      // res.cookie('token',token,{path:'/',maxAge:2*60,httpOnly:true}) // why 2minutes not work
      res.cookie('token',token,{path:'/',maxAge:24*60*60,httpOnly:true})
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
          return res.status(500).send({success:false,message:err.message})
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
