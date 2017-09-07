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
UserSchema.pre('save', async function(next) {
  const user = this
  try {
    const hash = await bcrypt.hash(user.password,saltRounds)
    user.password=hash
    next()
  } catch (err) {
    next(err)
  }
})
// 比较明文密码是否和数据库中密码相同，返回true/false
UserSchema.methods.comparePassword = (beforeBcryptPsd,bcryptPsd) => {
  return bcrypt.compare(beforeBcryptPsd, bcryptPsd).then(res=>res)
}

const UserModel = mongoose.model('User', UserSchema)
module.exports = UserModel