// pages/message/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Groupchat: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getchant()
  },
  getchant() {
    // 在页面中调用云函数进行连表查询
    wx.cloud.callFunction({
      name: 'GetMyGroup', // 替换成你的云函数名称
      data:{
        openid:wx.getStorageSync('openid')
      },
      success: res => {
        console.log(res.result);
        this.setData({
          Groupchat:res.result.data.list
        })
        // 在这里处理返回结果
      },
      fail: err => {
        console.error(err);
        // 在这里处理错误信息
      }
    });
  },
  //跳转页面
  gochat(e) {
    console.log(e.currentTarget.dataset.id)
    let name = e.currentTarget.dataset.name
    wx.navigateTo({
      url: '../chat/chat?id=' + e.currentTarget.dataset.id + '&name=' + name ,
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