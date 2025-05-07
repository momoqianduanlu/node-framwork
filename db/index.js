const config = require('../config/config.js')

module.exports = function(success, error) {
  if (typeof error !== 'function') {
    error = function() {
      console.log('数据库连接失败！');
    }
  }
  const mongoose = require('mongoose');
  mongoose.connect(config.url + config.db_name, {})

  mongoose.connection.once('open', () => {
    success()
  })

  mongoose.connection.on('error', () => {
    error()
  })

  mongoose.connection.on('close', () => {
    console.log('数据库连接关闭！');
  })
}

// 4.关闭数据库
setTimeout(() => {
  // mongoose.disconnect()
}, 3000)