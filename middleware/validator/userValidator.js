const { check } = require('express-validator');
const { User } = require('../../model/index.js')

// 注册校验规则
const regValidates = [
  check('username').notEmpty().withMessage('用户名不能为空').bail(),
  check('password').notEmpty().withMessage('密码不能为空').bail().isLength({ min: 6 }).withMessage('密码不能小于6位').bail(),
  check('phone').notEmpty().withMessage('手机号不能为空').bail().isLength({ min: 11, max: 11 }).withMessage('手机号格式不正确').bail().custom(async (value) => {
    // 自定义校验规则
    // 查询数据库是否存在该手机号
    const user = await User.findOne({ phone: value });
    if (user) {
      return Promise.reject('手机号已存在');
    }
  }).bail(),
  check('email').notEmpty().withMessage('邮箱不能为空').bail().isEmail().withMessage('邮箱格式不正确').bail().custom(async (value) => {
    // 自定义校验规则
    // 查询数据库是否存在该邮箱
    const user = await User.findOne({ email: value });
    if (user) {
      return Promise.reject('邮箱已存在');
    }
  }).bail()
]

// 登录校验规则
const loginValidates = [
  check('email').notEmpty().withMessage('邮箱不能为空').bail().isEmail().withMessage('邮箱格式不正确').bail(),
  check('password').notEmpty().withMessage('密码不能为空').bail().isLength({ min: 6 }).withMessage('密码不能小于6位').bail()
]

// 更新校验规则
const updateValidates = [
  check('email').custom(async (value) => {
    // 查询数据库是否存在该邮箱
    const email = await User.findOne({ email: value });
    if (email) {
      return Promise.reject('邮箱已存在');
    }
  }).bail(),
  check('username').custom(async (value) => {
    // 查询数据库是否存在该用户名
    const username = await User.findOne({ username: value });
    if (username) {
      return Promise.reject('用户名已存在');
    }
  }).bail(),
  check('phone').custom(async (value) => {
    // 查询数据库是否存在该手机号
    const phone = await User.findOne({ phone: value });
    if (phone) {
      return Promise.reject('手机号已存在');
    }
  }).bail()
]

module.exports = {
  regValidates,
  loginValidates,
  updateValidates
}