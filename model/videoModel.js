const mongoose = require('mongoose');
const md5 = require('../util/md5.js');
const baseModel = require('./baseModel.js');

// 定义用户模型
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
    ...baseModel
});

module.exports = videoSchema;
