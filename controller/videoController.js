const { Video, Comment, Favorite } = require('../model/index.js')

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

// 视频添加评论
const addComment = async (req, res) => {
  const { id } = req.params; // 获取视频id
  // 查询要评论的视频存不存在
  const video = await Video.findById(id);
  if (!video) {
    return res.json({
      code: 400,
      message: '该视频不存在！'
    })
  } else {
    // 对视频进行评论
    const commentModel = new Comment({
      content: req.body.content,
      user: req.userInfo.user._id,
      video: id
    });
    try {
      const dbBack = await commentModel.save();
      // 更新视频的评论数
      await Video.findByIdAndUpdate(id, {
        $inc: { commentCount: 1 } // $inc 是自增
      })
      res.json({
        code: 200,
        message: '评论成功！',
        result: dbBack
      })
    } catch (error) {
      res.json({
        code: 400,
        message: '评论失败！',
        error: error
      })
    }
  }
}

// 获取某条视频的评论列表
const getCommentList = async (req, res) => {
  const { id } = req.params; // 获取视频id
  // 查询要评论的视频存不存在
  const video = await Video.findById(id);
  if (!video) {
    return res.json({
      code: 400,
      message: '该视频不存在！'
    })
  } else {
    // 获取视频的评论列表
    try {
      const dbBack = await Comment.find({ video: id })
        .populate('user', '_id username')
        .sort({ createAT: -1 });  
      res.json({
        code: 200,
        message: '获取评论列表成功！',
        result: dbBack
      })
    } catch (error) {
      res.json({
        code: 400,
        message: '获取评论列表失败！',
        error: error
      })
    }
  }
}

// 删除某条视频的评论
const deleteComment = async (req, res) => {
  const { videoId, commentId } = req.params; // 获取视频id
  // 1. 查询要评论的视频存不存在
  const video = await Video.findById(videoId);
  if (!video) {
    return res.json({
      code: 400,
      message: '该视频不存在！'
    })
  } else {
    // 2. 视频的评论存不存在
    const comment = await Comment.findById(commentId);  
    if (!comment) {
      return res.json({
        code: 400,
        message: '该评论不存在！'
      })
    }
    // 3. 评论的用户是否是当前用户
    if (comment.user.toString() !== req.userInfo.user._id.toString()) {
      return res.json({
        code: 400,
        message: '你没有权限删除该评论！'
      })
    }
    // 4. 删除评论
    try {
      const dbBack = await Comment.findByIdAndDelete(commentId);
      // 更新视频的评论数
      await Video.findByIdAndUpdate(videoId, {
        $inc: { commentCount: -1 } // $inc 是自增
      })
      res.json({
        code: 200,
        message: '删除评论成功！',
        result: dbBack
      })
    }  catch (error) {
      res.json({
        code: 400,
        message: '删除评论失败！',
        error: error
      })
    }
    
  }
}

// 喜欢视频
const favorite = async (req, res) => {
  const { id } = req.params; // 获取视频id
  // 1. 查询喜欢的视频存不存在
  const video = await Video.findById(id);

  let isLike = true;

  if (!video) {
    return res.json({
      code: 400,
      message: '该视频不存在！'
    })
  }
  // 2. 查看当前登录用户是否喜欢过该视频
  const favorite = await Favorite.findOne({
    user: req.userInfo.user._id,
    video: id
  });
  if (favorite && favorite.like === 1) {
    // 已经喜欢过该视频！取消喜欢并删除该条记录
    isLike = false;
    await Favorite.findByIdAndDelete(favorite._id);
  }  else if (favorite && favorite.like === -1) {
    // 之前不喜欢该视频！喜欢该视频
    await Favorite.findByIdAndUpdate(favorite._id, {
      like: 1
    })
  } else {
    // 没有喜欢过该视频！喜欢该视频
    const favoriteModel = new Favorite({
      user: req.userInfo.user._id,
      video: id,
      like: 1
    });
    try {
      await favoriteModel.save();
    } catch (error) {
      res.json({
        code: 400,
        message: '喜欢失败！',
        error: error
      })
    }
  }
  // 获取视频的喜欢数量和不喜欢数量，并更新到视频表中 (countDocuments方法用于返回符合查询条件的文档数量)
  video.favoriteCount = await Favorite.countDocuments({
    video: id,
    like: 1
  });
  video.unfavoriteCount = await Favorite.countDocuments({
    video: id,
    like: -1
  });
  await video.save();
  res.json({
    code: 200,
    message: '成功！',
    result: video,
    isLike
  })
}

// 不喜欢视频
const unfavorite = async (req, res) => {
  const { id } = req.params; // 获取视频id
  // 1. 查询不喜欢的视频存不存在
  const video = await Video.findById(id);

  let disLike = true;

  if (!video) {
    return res.json({
      code: 400,
      message: '该视频不存在！'
    })
  }
  // 2. 查看当前登录用户是否不喜欢过该视频
  const favorite = await Favorite.findOne({
    user: req.userInfo.user._id,
    video: id
  });
  if (favorite && favorite.like === -1) {
    // 已经不喜欢过该视频！取消不喜欢并删除该条记录
    await Favorite.findByIdAndDelete(favorite._id);
  }  else if (favorite && favorite.like === 1) {
    // 之前喜欢该视频！改成不喜欢
    disLike = false;
    await Favorite.findByIdAndUpdate(favorite._id, {
      like: -1
    })
  } else {
    // 不喜欢该视频
    const favoriteModel = new Favorite({
      user: req.userInfo.user._id,
      video: id,
      like: -1
    });
    try {
      await favoriteModel.save();
      disLike = false;
    } catch (error) {
      res.json({
        code: 400,
        message: '不喜欢失败！',
        error: error
      })
    }
  }
  // 获取视频的喜欢数量和不喜欢数量，并更新到视频表中 (countDocuments方法用于返回符合查询条件的文档数量)
  video.favoriteCount = await Favorite.countDocuments({
    video: id,
    like: 1
  });
  video.unfavoriteCount = await Favorite.countDocuments({
    video: id,
    like: -1
  });
  await video.save();
  res.json({
    code: 200,
    message: '成功！',
    result: video,
    disLike
  })
}

module.exports = {
  videoList,
  getVideo,
  createVideo,
  addComment,
  getCommentList,
  deleteComment,
  favorite,
  unfavorite
}