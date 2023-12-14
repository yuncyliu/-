// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  try {
    const SendResult = await db.collection('send').where({
      _openid: event.openid,
      time1: _.gt(event.time)
    }).get()
    const SendData = SendResult.data

    const Addresult = await db.collection('myadd').aggregate()
      .lookup({
        from: 'send',
        localField: 'dataid',
        foreignField: '_id',
        as: 'list'
      })
      .match({
        _openid:event.openid, // 查询条件
      })
      .end();
      // const Addresult =[]
      // if(AddresultData.length){
      //   Addresult = AddresultData.list[0].list.filter(obj => obj.time1 < event.time);
      // }
      return{
        SendData,
        Addresult
      }
  } catch (err) {
    console.log(err)
    return err
  }
}