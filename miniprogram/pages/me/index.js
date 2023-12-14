const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    src: '../../images/pt.png',
    login: false,
    name: '点击登录',
    TabCur: 0,
    scrollLeft: 0,
    Tab: ['发车记录', '上车记录', '其他']
  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },
  //跳转到登录页面
  login() {
    wx.navigateTo({
      url: '../login/index',
    })
  },
  goEdit() {
    wx.navigateTo({
      url: '../Edit/index',
    })
  },
  //确定注销
  confirm() {
    var that = this
    wx.showModal({
      title: '提示',
      content: '确认注销？',
      complete: (res) => {
        if (res.confirm) {
          const time = Date.parse(new Date());
          console.log(time)

          // const promise2 = new Promise((resolve, reject) => {
          //   db.collection('myadd').where({_openid:openid,time1: _.lt(time)}).get().then(res=>{
          //     resolve(res)
          //   }).catch(err=>{
          //     reject(err)
          //   })
          // })
          wx.cloud.callFunction({
            name: "Cancel",
            data: {
              openid: wx.getStorageSync('openid'),
              time: time
            }
          }).then(res => {
            console.log(res)
            const _ = db.command
            let SendData = res.result.SendData
            let AddData = res.result.Addresult.list.length == 0 ? res.result.Addresult.list : res.result.Addresult.list[0].list.filter(obj => obj.time1 > time);
            console.log(AddData);
            if (SendData.length != 0 || AddData.length != 0) {
              that.setData({
                modalName: "DialogModal2",
                SendData: res.result.SendData,
                AddData: AddData
              })
            } else {
              console.log("注销");
              const openid = wx.getStorageSync('openid')
              let promise1 = new Promise((resolve, reject) => {
                db.collection('send').where({
                  _openid: openid
                }).get().then(res => {
                  const SendData = res.data
                  // 获取所有的 _id
                  const Ids = SendData.map(item => item._id)
                  resolve(Ids)
                }).catch(err => {
                  reject(err)
                })
              })
              let promise2 = promise1.then(Ids => {
                return new Promise((resolve, reject) => {
                  db.collection('myadd').where({
                    dataid: _.in(Ids),
                  }).remove().then(res => {
                    resolve(res)
                  })
                });
              });
              let promise3 = promise1.then(Ids => {
                return new Promise((resolve, reject) => {
                  db.collection('MyGroup').where({
                    datasendid: _.in(Ids),
                  }).remove().then(res => {
                    resolve(res)
                  })
                });
              });
              let promise4 = promise1.then(Ids => {
                return new Promise((resolve, reject) => {
                  db.collection('Groupchats').where({
                    data_id: _.in(Ids),
                  }).remove().then(res => {
                    resolve(res)
                  })
                });
              });
              let promise5 = new Promise((resolve, reject) => {
                db.collection('UserInfo').where({
                  _openid: openid,
                }).remove().then(res => {
                  resolve(res)
                })
              });
              let promise6 = new Promise((resolve, reject) => {
                db.collection('send').where({
                  _openid: openid,
                }).remove().then(res => {
                  resolve(res)
                })
              });
              Promise.all([promise1, promise2, promise3, promise4, promise5, promise6])
                .then((results) => {
                  console.log(results)
                  wx.removeStorageSync('openid')
                  wx.navigateTo({
                    url: "../login/index",
                    success(res) {
                      wx.showToast({
                        title: '注销成功！',
                      })
                    }
                  })
                  // 所有异步操作都执行成功的处理代码
                })
                .catch((error) => {
                  console.log(error)
                  wx.showToast({
                    title: '注销失败！',
                    icon: "error"
                  })
                  // 任意一个异步操作出现错误时的处理代码
                })
            }
          })
        }
      }
    })
  },
  //跳转页面
  gotosend() {
    wx.navigateTo({
      url: '../mysend/index',
    })
  },
  gotoadd() {
    wx.navigateTo({
      url: '../myadd/index',
    })
  },
  //客服
  handleContact(e) {
    console.log(e.detail.path)
    console.log(e.detail.query)
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
    this.setData({
      name: Info.userinfo.nickName,
      src: Info.userinfo.avatarUrl,
      login: app.globalData.login
    })
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
 
    let Info = app.globalData
    this.setData({
      name: Info.userinfo.nickName,
      src: Info.userinfo.avatarUrl,
      login: app.globalData.login
    })

  },
  onRefresh:function(){
    //导航条加载动画
    wx.showNavigationBarLoading()
    //loading 提示框
    wx.showLoading({
      title: 'Loading...',
    })
    console.log("下拉刷新啦");
    setTimeout(function () {
      wx.hideLoading();
      wx.hideNavigationBarLoading();
      //停止下拉刷新
      wx.stopPullDownRefresh();
    }, 1000)
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

  },
  login() {
    wx.navigateTo({
      url: '../login/index',
      success: function (res) {},
      fail: function (res) {},
      sscomplete: function (res) {},
    })
  }
})