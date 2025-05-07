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

router.get('/list', verifyToken, userController.userList);

router.put('/update', verifyToken, validators(updateValidates), userController.update);

router.post('/avatar', verifyToken, upload.single('avatar'), userController.avatar);

module.exports = router;
