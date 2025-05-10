const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const { regValidates, loginValidates, updateValidates } = require('../middleware/validator/userValidator');
const validators = require('../middleware/validator/errorBack');
const { verifyToken } = require('../util/jwt');
const multer = require('multer');
const upload = multer({ dest: 'public/' });


router.post('/reg',
  /**
   * 校验规则
   */
  validators(regValidates),
  userController.reg);

router.post('/login', validators(loginValidates), userController.login);

router.get('/list', verifyToken(), userController.userList);

router.put('/update', verifyToken(), validators(updateValidates), userController.update);

router.post('/avatar', verifyToken(), upload.single('avatar'), userController.avatar);

// 订阅频道
router.get('/subscribe/:id', verifyToken(), userController.subscribe);

// 取消订阅频道
router.get('/unsubscribe/:id', verifyToken(), userController.unsubscribe);

// 获取订阅频道信息
router.get('/getSubscribes/:id', verifyToken(false), userController.getSubscribes);

// 获取关注列表
router.get('/getSubscribeList/:id', userController.getSubscribeList);

// 获取粉丝列表
router.get('/getFansList', verifyToken(), userController.getFansList);

module.exports = router;
