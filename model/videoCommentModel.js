const mongoose = require('mongoose');
const baseModel = require('./baseModel.js');

// 定义评论模型
const commentSchema = new mongoose.Schema({
    content: {
      type: String,
      required: true,
    },
    user: { // 评论视频的用户id
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    video: { // 视频id
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Video',
      required: true
    },
    ...baseModel
});

module.exports = commentSchema;
