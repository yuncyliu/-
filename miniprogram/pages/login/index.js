// pages/login/index.js
const db = wx.cloud.database()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    src: ''
  },
  //获取用户头像
  bindchooseavatar(e) {
    console.log(e)
    this.setData({
      src: e.detail.avatarUrl
    })
  },
  onChange(event) {
    // event.detail 为当前输入的值
    console.log(event.detail);
    this.setData({
      name: event.detail.value
    })
  },
  //用户点击登录
  login(e) {
    var that = this
    if (that.data.name == "" || that.data.src == "") {
      wx.showToast({
        title: '请输入内容',
        icon: "none"
      })
      return
    }
    wx.showLoading({
      title: '请稍后',
    })
    let filePath = that.data.src
    let suffix = /\.[^\.]+$/.exec(filePath)[0]; // 正则表达式，获取文件扩展名
    wx.cloud.uploadFile({
      cloudPath: `cloudFaceimg/${new Date().getTime() + suffix}`,
      filePath: filePath, // 文件路径
    }).then(res => {
      console.log("上传结果", res.fileID)
      let fileId = res.fileID
      db.collection('UserInfo').add({
        data: {
          avatarUrl: fileId,
          nickName: that.data.name,
          mytop:[]
        }
      }).then(res => {
        let info ={
          avatarUrl:fileId,
          nickName:that.data.name,
        }
        app.globalData.userinfo = info,
        app.globalData.login = true
        console.log(res)
        wx.hideLoading()
        wx.navigateBack()
      })
    }).catch(error => {
      console.log("上传失败", error)
      wx.showToast({
        title: '上传失败',
        icon: 'error'
      })
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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