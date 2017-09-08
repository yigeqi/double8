const UserModel = require('../db/userModel')
const jwt = require('jsonwebtoken')
const redisClient = require('../db/redis.js')
const config = require('../config')

exports.login = async(req, res) => {
  const username = req.body.username
  const password = req.body.password
  try {
    const user = await UserModel.findOne({username})
    if (user) {
      const isSame = await user.comparePassword(password, user.password)
      if (!isSame) {
        return res.json({success:false,message:'password not right'})
      }
      const user_id = user._id.toString()
      const token = jwt.sign({id: user_id}, 'hahaha')
      redisClient.set(user_id, token, 'EX', config.expire)
      // 把token存在cookie里发给客户端,设置cookie的有效期
      res.cookie('token',token,{path:'/',maxAge:config.expire*1000,httpOnly:true})
      return res.json({user})
    } else {
      return res.json({success:false,message:'user not exist or password not right.'})
    }
  } catch (err) {
    return res.status(500).send({success:false,message:err.message});
  }
}
exports.register = async(req, res) => {
  const username = req.body.username
  const password = req.body.password
  try {
    const user = await UserModel.findOne({username})
    if (user) {
      return res.json({success:false,message:'user already exist.'})
    }
    var newuser = new UserModel({username,password})
    await newuser.save()
    return res.sendStatus(200)
  } catch (err) {
    return res.status(500).send({success:false,message:err.message})
  }
}
exports.logout = (req, res) => {
  if (req.user) {
    redisClient.set(req.user.id, req.user.token, 'EX', 1)
    delete req.user;  
    return res.sendStatus(200);
  } else {
    return res.status(403).send({success:false,message:'no token provided'})
  }
}
