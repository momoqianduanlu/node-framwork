const { User } = require('../model/index.js')
const { generateToken } = require('../util/jwt.js')
const fs = require('fs')

const reg = async (req, res) => {
  const userModel = new User(req.body);

  const result = await userModel.save();
  console.log(result);
  if (!result) {
    res.json({
      code: 400,
      message: '注册失败！'
    })
  } else {
    res.json({
      code: 200,
      message: '注册成功！',
      result: {
        username: result.username,
        email: result.email,
        avatar: result.avatar
      }
    })
  }
}

const login = async (req, res) => {
  // 登录校验规则 loginValidates
  // 连接数据库，查询用户信息
  // token生成
  const user = await User.findOne({
    email: req.body.email,
    password: req.body.password
  })
  if (!user) {
    res.json({
      code: 402,
      message: '用户名或密码错误！'
    })
  } else {
    const dbBack = user.toJSON()
    dbBack.token = await generateToken(dbBack)
    res.json({
      code: 200,
      message: '登录成功！',
      result: dbBack
    })
  }
}

const userList = async (req, res) => {
  res.send('user list view');
}

// 更新用户信息
const update = async (req, res) => {
  // 修改用户信息
  const dbBack = await User.findByIdAndUpdate(req.userInfo.user._id, req.body, {
    // 返回修改后的数据
    new: true
  })
  if (!dbBack) {
    res.json({
      code: 400,
      message: '更新失败！'
    })
  } else {
    res.json({
      code: 200,
      message: '更新成功！',
      result: dbBack
    })
  }
}

// 上传头像
const avatar = async (req, res) => {
  // 获取文件后缀
  const extname = req.file.originalname.split('.').pop();
  const newFileName = req.file.filename + '.' + extname;
  /**
   * 使用multer中间件上传的文件，会被保存在public文件夹下，
   * 上传成功后的文件会挂载到req.file对象上，
   * 然后使用fs.renameSync方法将文件进行重命名
   */
  fs.renameSync(req.file.path, 'public/' + newFileName)
  console.log(req.file);
  res.send('user list view');
}

module.exports = {
  userList,
  avatar,
  update,
  reg,
  login
}