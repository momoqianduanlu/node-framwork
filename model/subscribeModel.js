const mongoose = require('mongoose');
const baseModel = require('./baseModel.js');

// 定义频道模型
const subscribeSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    channle: { // 关注者信息
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User' // 关联的模型名称
    },
    ...baseModel
});

module.exports = subscribeSchema;
