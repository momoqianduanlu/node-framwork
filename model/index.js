const mongoose = require('mongoose');

module.exports = {
  // 引入模型，定义集合
  User: mongoose.model('User', require('./userModel')),
  Video: mongoose.model('Video', require('./videoModel')),
  // Comment: require('./commentModel')
}