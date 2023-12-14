const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  bindchooseavatar(e) {
    console.log(e)
    let filePath = e.detail.avatarUrl
    let suffix = /\.[^\.]+$/.exec(filePath)[0]; // 正则表达式，获取文件扩展名
    wx.cloud.uploadFile({
      cloudPath: `cloudFaceimg/${new Date().getTime() + suffix}`,
      filePath: filePath, // 文件路径
    }).then(res => {
      console.log("上传结果", res.fileID)
      let fileId = res.fileID
      db.collection('UserInfo').where({
        _openid: wx.getStorageSync('openid')
      }).update({
        data: {
          avatarUrl: fileId,
        }
      }).then(res => {
        this.setData({
          src: fileId
        })
        app.globalData.userinfo.avatarUrl = fileId
        wx.showToast({
          title: '更新成功',
        })
      })
    })
  },
  onChange(event) {
    // event.detail 为当前输入的值
    console.log(event);
    this.setData({
      name: event.detail.value
    })

  },
  //修改
  edit() {
    wx.showModal({
      title: '提示',
      content: '确认修改？',
      complete: (res) => {
        if (res.confirm) {
          var that = this
          if (that.data.name == "") {
            wx.showToast({
              title: '请输入内容',
              icon: "none"
            })
            return
          }
          wx.showLoading({
            title: '请稍后',
          })
          db.collection('UserInfo').where({
            _openid: wx.getStorageSync('openid')
          }).update({
            data: {
              nickName: that.data.name
            }
          }).then(res => {
            console.log(res)
            app.globalData.userinfo.nickName = that.data.name
            wx.navigateBack({
              delta: 1,
              success(res) {
                wx.showToast({
                  title: '修改成功！',
                })
              }
            })
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let Info = app.globalData
    console.log(Info)
    if (Info) {
      this.setData({
        name: Info.userinfo.nickName,
        src: Info.userinfo.avatarUrl,
        login: true
      })
    }
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