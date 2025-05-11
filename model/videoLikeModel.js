const mongoose = require('mongoose');
const md5 = require('../util/md5.js');
const baseModel = require('./baseModel.js');

// 定义收藏模型
const videoLikeSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // 关联的模型名称
      required: true
    },
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Video', // 关联的模型名称
      required: true
    },
    like: {
      type: Number,
      enum: [1, -1], // 1 表示点赞，-1 表示取消点赞
      required: true,
    },
    ...baseModel
});

module.exports = videoLikeSchema;
