const mongoose = require('mongoose')
var timestamps    = require('mongoose-timestamp')

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
})
UserSchema.plugin(timestamps)

const UserModel = mongoose.model('User', UserSchema)
module.exports = UserModel