const RPCClient = require('@alicloud/pop-core').RPCClient;
const config = require('../config/config');

const client = new RPCClient({
  accessKeyId: config.accessKeyId,
  accessKeySecret: config.accessKeySecret,
  endpoint: 'http://vod.cn-shanghai.aliyuncs.com', // https
  apiVersion: '2017-03-21',
});

// 获取阿里云vod视频上传凭证
/**
 * 1. 安装sdk依赖 npm install @alicloud/pop-core
 * 2. 引入sdk const RPCClient = require('@alicloud/pop-core').RPCClient;
 * 3. 客户端初始化 https://help.aliyun.com/zh/sdk/developer-reference/initialize-an-sdk-client?spm=a2c4g.11186623.help-menu-262060.d_1_7_2_3.33a5308cfkYegf&scm=20140722.H_311655._.OR_help-T_cn~zh-V_1
 * 4. 前端调用服务端接口，服务端向阿里云VOD发起请求，获取凭证，返回凭证给前端，
 * 5. 前端使用凭证上传视频
 */
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