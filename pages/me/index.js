const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    src:'../../images/pt.png',
    login:false,
    name:'点击登录',
    TabCur: 0,
    scrollLeft:0,
    Tab:['发车记录','上车记录','其他']
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id-1)*60
    })
  },
  //跳转到登录页面
  login(){
    wx.navigateTo({
      url: '../login/index',
    })
  },
  //跳转页面
  gotosend(){
    wx.navigateTo({
      url: '../mysend/index',
    })
  },
  gotoadd(){
    wx.navigateTo({
      url: '../myadd/index',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let Info = app.globalData
    console.log(Info)
    if(Info.login){
      this.setData({
        name:Info.userinfo.nickName,
        src:Info.userinfo.avatarUrl,
        login:true
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})