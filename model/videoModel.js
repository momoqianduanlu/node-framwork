const mongoose = require('mongoose');
const md5 = require('../util/md5.js');
const baseModel = require('./baseModel.js');

// 定义视频模型
const videoSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: false
    },
    vodVideoId: {
      type: String,
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // 关联的模型名称
      required: true
    },
    cover: {
      type: String,
      required: false
    },
    commentCount: { // 评论数
      type: Number,
      default: 0
    },
    ...baseModel
});

module.exports = videoSchema;
