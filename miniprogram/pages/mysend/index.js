// pages/mysend/index.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getinfo()
  },
  //删除数据
  Delete(e){
    let id = e.currentTarget.dataset.id
    wx.showModal({
      title: '提示',
      content: '确定删除？',
      complete: (res) => {
        if (res.confirm) {
          let promise1 =  new Promise((resolve, reject) => {
            db.collection('send').doc(id).remove().then(res=>{
              resolve(res)
            })
          })
          let promise2 =  new Promise((resolve, reject) => {
            db.collection('Groupchats').where({data_id:id}).remove().then(res=>{
              resolve(res)
            })
          })
          let promise3 =  new Promise((resolve, reject) => {
            db.collection('MyGroup').where({datasendid:id}).remove().then(res=>{
              resolve(res)
            })
          })
          Promise.all([promise1, promise2, promise3])
            .then((results) => {
              console.log(results)
              wx.navigateBack({
                delta: 2,
                success(res) {
                  wx.showToast({
                    title: '删除成功！',
                  })
                }
              })
              // 所有异步操作都执行成功的处理代码
            })
            .catch((error) => {
              console.log(error)
              wx.showToast({
                title: '删除失败！',
                icon: "error"
              })
              // 任意一个异步操作出现错误时的处理代码
            })

        }
      }
    })
  },
  //获取数据
  getinfo() {
    wx.cloud.database().collection("send").where({
      _openid: wx.getStorageSync('openid')
    }).get().then(res => {
      console.log(res)
      this.setData({
        list: res.data
      })
    })
  },


  //跳转详情页
  goinfo(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../index/info?id=' + id,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})