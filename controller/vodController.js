const RPCClient = require('@alicloud/pop-core').RPCClient;
const config = require('../config/config');

const client = new RPCClient({
  accessKeyId: config.accessKeyId,
  accessKeySecret: config.accessKeySecret,
  endpoint: 'http://vod.cn-shanghai.aliyuncs.com', // https
  apiVersion: '2017-03-21',
});

// 获取阿里云vod视频上传凭证
const getVod = async (req, res) => {
  const params = {
    Title: 'test',
    Description: 'test',
    FileName: 'test.mp4',
  };
  const vodBack = await client.request('CreateUploadVideo', params, {
    timeout: 3000, // 超时时间
    formatAction: true,
    formatParams: true,
    method: 'GET',
    headers: {},
  })
  console.log('vodBack', vodBack);
  if (vodBack) {
    res.json({
      code: 200,
      message: '上传成功！',
      result: vodBack
    })
  }
}

module.exports = {
  getVod
}