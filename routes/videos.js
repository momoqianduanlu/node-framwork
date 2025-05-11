const express = require('express');
const router = express.Router();
const videoController = require('../controller/videoController');
const vodController = require('../controller/vodController');
const { verifyToken } = require('../util/jwt');
const validators = require('../middleware/validator/errorBack');
const { createVideoValidates } = require('../middleware/validator/videoValidator');


// 获取视频列表
router.get('/videoList', verifyToken(), videoController.videoList);

// 获取阿里云vod视频上传凭证
router.get('/getVod', vodController.getVod);

// 获取视频详情
// 接口是半登录状态，既可以登录返回数据，也可以不登录返回数据
router.get('/getVideo/:id', verifyToken(false), videoController.getVideo);

// 视频信息入库操作
router.post('/createVideo', verifyToken(), validators(createVideoValidates), videoController.createVideo);

// 视频添加评论
router.post('/addComment/:id', verifyToken(), videoController.addComment);

// 获取某条视频的评论
router.get('/getCommentList/:id', verifyToken(false), videoController.getCommentList);

// 删除某条视频的评论
router.delete('/deleteComment/:videoId/:commentId', verifyToken(), videoController.deleteComment);

module.exports = router;
