// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  // 查询发布表
  const SendResult = await db.collection('send').where({
    _openid: event.openid
  }).get()
  const SendData = SendResult.data
  // 获取所有的 _id
  const Ids = SendData.map(item => item._id)
  try {
    await db.collection('send').where({
      _openid: event.openid,
    }).remove();
    await db.collection('myadd').where({
      dataid: _.in(Ids),
    }).remove();
    await db.collection('MyGroup').where({
      datasendid: _.in(Ids),
    }).remove();
    await db.collection('Groupchats').where({
      data_id: _.in(Ids),
    }).remove();
    await db.collection('UserInfo').where({
      _openid: event.openid,
    }).remove();
    return { code: 0, message: 'success' };
  } catch (err) {
    console.error(err);
    return {
      code: -1,
      message: 'failed'
    };
  }
}