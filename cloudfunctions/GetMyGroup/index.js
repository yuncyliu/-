// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境// 在云函数中引入数据库模块
const db = cloud.database();

// 在云函数中定义连表查询函数
exports.main = async (event, context) => {
  try {
    const result = await db.collection('MyGroup').aggregate()
      .lookup({
        from: 'Groupchats',
        localField: 'data_id',
        foreignField: '_id',
        as: 'list'
      })
      .match({
        _openid: event.openid, // 查询条件，筛选openid等于event中的openid属性的数据
      })
      .end();

    // 去除重复的数据
    // const data = Array.from(new Set(result.list.map(JSON.stringify))).map(JSON.parse);
    console.log(result)  
    return {
      code: 0,
      data: {
        ...result,
        list: result,
      },
    };
  } catch (err) {
    return {
      code: -1,
      message: err.message,
    };
  }
}