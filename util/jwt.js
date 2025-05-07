const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const config = require('../config/config.js');
const toJWT = promisify(jwt.sign);
const toJWTVerify = promisify(jwt.verify);

// 生成 token
module.exports.generateToken = async (user) => {
  // 生成 token
  return await toJWT({ user }, config.secret, { expiresIn: 60 * 60 * 24 })
}

// 验证 token
module.exports.verifyToken = async (req, res, next) => {
  let token = req.headers.authorization;
  token = token ? token.split('Bearer ')[1] : null; // 从 header 中获取 token
  if (!token) {
    return res.status(401).json({
      code: 401,
      message: '未登录！'
    })
  }
  try {
    // 验证 token
    const decoded = await toJWTVerify(token, config.secret);
    req.userInfo = decoded
    next();
  } catch (error) {
    return res.status(401).json({
      code: 401,
      message: '登录已过期！'
    })
  }
}
