// pages/myadd/index.js
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
  //获取数据
  getinfo() {
    wx.cloud.database().collection("myadd").where({
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