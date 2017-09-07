const mongoose = require('mongoose')
const timestamps  = require('mongoose-timestamp')
const bcrypt = require('bcrypt')

const saltRounds = 8
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
})
UserSchema.plugin(timestamps)
// 把用户的password编码后再存入数据库
UserSchema.pre('save', function(next) {
  const user = this
  bcrypt.genSalt(saltRounds, (err, salt) => {
    if (err) return next(err)
    bcrypt.hash(user.password, salt, (err, hash)=>{
      if (err) return next(err)
      user.password = hash
      next()
    })
  })
})
// 比较明文密码是否和数据库中密码相同，返回true/false
UserSchema.methods.comparePassword = (beforeBcryptPsd,bcryptPsd) => {
  return bcrypt.compare(beforeBcryptPsd, bcryptPsd).then(res=>res)
}

const UserModel = mongoose.model('User', UserSchema)
module.exports = UserModel