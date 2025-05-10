const { Video } = require('../model/index.js')

const videoList = async (req, res) => {
  // 分页操作
  const { pageNum = 1, pageSize = 10 } = req.body;
  const dbBack = await Video.find()
    .skip((pageNum - 1) * pageSize)
    .limit(Number(pageSize))
    .sort({ createAT: -1 })
    .populate('user'); // 关联查询用户信息
  const total = await Video.countDocuments(); // 查询总条数
  res.json({
    code: 200,
    message: '获取视频列表成功！',
    result: {dbBack, total}
  })
}

const getVideo = async (req, res) => {
  const { id } = req.params;
  try {
    const dbBack = await Video.findById(id).populate('user', '_id, username');
    res.json({
      code: 200,
      message: '获取视频详情成功！',
      result: dbBack
    })
  } catch (error) {
    res.json({
      code: 400,
      message: '获取视频详情失败！',
      error: error
    })
  }
}


const createVideo = async (req, res) => {
  const user = req.userInfo.user._id
  req.body.user = user;
  const videoModel = new Video(req.body);
  try {
    const dbBack = await videoModel.save();
    res.json({
      code: 200,
      message: '创建视频成功！',
      result: dbBack
    })
  } catch (error) {
    res.json({
      code: 400,
      message: '创建视频失败！',
      error: error
    })
  }
}

module.exports = {
  videoList,
  getVideo,
  createVideo
}