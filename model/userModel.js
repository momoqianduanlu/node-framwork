const mongoose = require('mongoose');
const md5 = require('../util/md5.js');
const baseModel = require('./baseModel.js');

// 定义用户模型
const userSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true,
      set: function(val) { // set 是在保存数据之前对数据进行处理
        // 对密码进行加密
        return md5(val)
      },
      select: false // 查询时不返回密码
    },
    email: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: 'default.jpg'
    },
    cover: { // 频道封面
      type: String,
      default: ''
    },
    channeldes: { // 频道描述
      type: String,
      default: ''
    },
    phone: {
      type: String,
      default: '12345678901'
    },
    ...baseModel
});

module.exports = userSchema;
