const { User, Subscrible } = require('../model/index.js')
const { generateToken } = require('../util/jwt.js')
const fs = require('fs')
const lodash = require('lodash')

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
  // 返回用户列表
  const dbBack = await User.find()
  if (!dbBack) {
    res.json({
      code: 400,
      message: '获取用户列表失败！'
    })
  }
  res.json({
    code: 200,
    message: '获取用户列表成功！',
    result: dbBack
  })
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
  try {
    fs.renameSync(req.file.path, 'public/' + newFileName)
    res.json({
      code: 200,
      message: '上传成功！',
      result: newFileName
    })
  } catch (error) {
    res.json({
      code: 400,
      message: '上传失败！'
    })
  }
}

// 视频订阅
const subscribe = async (req, res) => {
  /**
   * 1. 不能订阅自己
   */
  const userId = req.userInfo.user._id; // 登录用户id
  const channleId = req.params.id; // 频道id
  if (userId === channleId) {
    res.json({
      code: 400,
      message: '不能订阅自己！'
    })
  } else {
    // 2. 查询是否已经订阅过
    const dbBack = await Subscrible.findOne({
      user: userId,
      channle: channleId
    })
    if (dbBack) {
      res.json({
        code: 400,
        message: '已经订阅过了！'
      })
    } else {
      // 3. 订阅
      const subscribleModel = new Subscrible({
        user: userId,
        channle: channleId,
      })
      const result = await subscribleModel.save();
      if (!result) {
        res.json({
          code: 400,
          message: '订阅失败！'
        })
      } else {
        // 4. 订阅成功以后，要把被关注者的粉丝数+1
        // findByIdAndUpdate 方法用于查找一个文档并更新它，同时返回更新前的文档
        await User.findByIdAndUpdate(channleId, {
          // 在更新过程中使用 $inc 操作符来增加一个或多个字段的值
          $inc: {
            subscribeCount: 1
          }
        })
        res.json({
          code: 200,
          message: '订阅成功！',
          result
        })
      }
    }
  }
}

// 取消订阅
const unsubscribe = async (req, res) => {
  /**
   * 1. 不能取消自己的订阅
   */
  const userId = req.userInfo.user._id; // 登录用户id
  const channleId = req.params.id; // 频道id
  if (userId === channleId) {
    res.json({
      code: 400,
      message: '不能取消自己的订阅！'
    })
  } else {
    // 2. 查询是否已经订阅过
    const dbBack = await Subscrible.findOne({
      user: userId,
      channle: channleId
    })  
    if (!dbBack) {
      res.json({
        code: 400,
        message: '该频道没有订阅过！'
      })
    } else {
      // 3. 取消订阅
      const result = await Subscrible.findByIdAndDelete(dbBack._id);
      if (!result) {
        res.json({
          code: 400,
          message: '取消订阅失败！'
        })
      } else {
        // 4. 取消订阅成功以后，要把被关注者的粉丝数-1
        await User.findByIdAndUpdate(channleId, {
          $inc: {
            subscribeCount: -1
          }
        })
        res.json({
          code: 200,
          message: '取消订阅成功！',
          result
        })
      }
    }
  }
}

// 获取订阅频道信息
const getSubscribes = async (req, res) => {
  const userId = req.userInfo.user._id; // 登录用户id
  const channleId = req.params.id; // 频道id

  let isSubscrible = false; // 是否订阅
  
  if (req.userInfo) {
    // 1. 查看当前登录用户是否有订阅
    const dbBack = await Subscrible.findOne({
      user: userId,
      channle: channleId
    })
    if (dbBack) {
      // 2. 订阅过该频道
      isSubscrible = true;
      // 3. 获取频道信息
      const user = await User.findById(channleId);
      if (!user) {
        res.json({
          code: 400,
          message: '获取频道信息失败！'
        })
      } else {
        res.json({
          code: 200,
          message: '获取频道信息成功！',
          result: {
            ...lodash.pick(user, ['_id', 'username', 'avatar', 'cover', 'subscribeCount']),
            isSubscrible
          }
        })
      }
    } else {
      // 4. 没有订阅过该频道 
      res.json({
        code: 400,
        message: '没有订阅的频道！'
      })
    }
  } else {
    // 没有订阅的频道
    res.json({
      code: 400,
      message: '没有订阅的频道！'
    })
  }
}

// 获取关注列表
const getSubscribeList = async (req, res) => {
  // 查询我关注的用户
  const dbBack = await Subscrible.find({
    user: req.params.id
  }).populate('channle')
  if (!dbBack) {
    res.json({
      code: 400,
      message: '获取关注列表失败！'
    })
  } else {
    res.json({
      code: 200,
      message: '获取关注列表成功！',
      result: dbBack
    })
  }
}

// 获取粉丝列表
const getFansList = async (req, res) => {
  // 查询关注我的用户
  const dbBack = await Subscrible.find({
    channle: req.userInfo.user._id
  }).populate('user')
  console.log('dbBack', dbBack);
  if (!dbBack) {
    res.json({
      code: 400,
      message: '获取粉丝列表失败！'
    })
  } else {
    res.json({
      code: 200,
      message: '获取粉丝列表成功！',
      result: dbBack
    })
  }
}

module.exports = {
  userList,
  avatar,
  update,
  subscribe,
  unsubscribe,
  getSubscribes,
  getSubscribeList,
  getFansList,
  reg,
  login
}