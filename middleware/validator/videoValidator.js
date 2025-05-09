const { check } = require('express-validator');
const { User } = require('../../model/index.js')

// 注册校验规则
const createVideoValidates = [
  check('title').notEmpty().withMessage('视频标题不能为空').bail().isLength({ min: 1, max: 30 }).withMessage('视频标题不能超过30个字符').bail(),
  check('vodVideoId').notEmpty().withMessage('vod视频id不能为空').bail(),
]

module.exports = {
  createVideoValidates
}