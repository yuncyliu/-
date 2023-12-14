// index.js
// const app = getApp()
let db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TabCur: 0,
    scrollLeft: 0,
    Tab: ['发车记录', '上车记录', '其他'],
    starttime: "",
    show: false,
    minHour: 10,
    maxHour: 20,
    minDate: new Date().getTime(),
    maxDate: new Date(2030, 12, 30).getTime(),
    currentDate: new Date().getTime(),
    show1: false,
    show2: false,
    value: '',
    searchn: "",
    lookserch: true,
    list4: [],
    columns: ['全部', '外卖', '网购', '搭子', '其他'],
    active: 0,
    imageList: ['/images/top1.png', '/images/top2.png', '/images/top3.png', '/images/top4.png', '/images/top5.png'], // 图片列表
    selectedImageList: ['/images/top1.2.png', '/images/top2.2.png', '/images/top3.2.png', '/images/top4.2.png', '/images/top5.2.png'] // 选中时的图片列表
  },
  tabSelect(e) {
    // this.cheek(e.currentTarget.dataset.id)
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },
  cheek(id) {
    var that = this
    let tag = true
    let arr = that.data.list
    let columns = that.data.columns
    for (var i = 0; i < arr.length; i++) {
      let time = Date.parse(new Date())
      let endtime = arr[i].time1 - time
      if (arr[i].type == columns[id] || endtime > 0) {
        tag = false
        return
      }
    }
    console.log(tag)
  },
  //跳转详情页
  goinfo(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../index/info?id=' + id,
    })
  },
  onChange2(event) {
    this.setData({
      active: event.detail.index
    })
  },
  // 获取用户输入值
  onChange(e) {
    let that = this

    if (e.detail == 0) {
      that.setData({
        lookserch: true
      })
    }
    that.setData({
      searchn: e.detail
    })

  },
  // 搜索商品
  onSearch() {
    let that = this
    wx.showLoading({
      title: '搜索中',
    })
    db.collection("send").where({ //毛搜索
        title: db.RegExp({
          regexp: that.data.searchn,
          options: 'i',
        })
      }).get()
      .then(res => {
        console.log(res)
        if (res.data.length == 0) { //无匹配结果
          wx.hideLoading()
          wx.showToast({
            title: '糟糕！没找到哦',
            icon: 'none'
          })
        }
        //查询到匹配结果
        else {
          wx.hideLoading()
          that.setData({
            lookserch: false,
            list4: res.data
          })

        }
      })

  },

  start(event) {
    // event.detail 为当前输入的值
    console.log(event.detail);
    this.setData({
      start: event.detail
    })
  },
  end(event) {
    // event.detail 为当前输入的值
    console.log(event.detail);
    this.setData({
      end: event.detail
    })
  },
  search() {
    var that = this
    let starttime = that.data.starttime
    let endtime = that.data.endtime
    let start = that.data.start
    let end = that.data.end
    wx.navigateTo({
      url: '../search/search?starttime=' + starttime + '&endtime=' + endtime + '&start=' + start + '&end=' + end,
    })
  },
  showPopup1() {
    this.setData({
      show1: true
    });
  },
  showPopup2() {
    this.setData({
      show2: true
    });
  },
  onInput(event) {
    let time = this.timestampToTime(event.detail)
    this.setData({
      starttime: event.detail,
      time: time,
      show1: false,
    });
  },
  onInput1(event) {
    let time = this.timestampToTime(event.detail)
    this.setData({
      endtime: event.detail,
      time1: time,
      show2: false,
    });
  },

  /* 时间戳转换为时间 */
  timestampToTime(timestamp) {
    timestamp = timestamp ? timestamp : null;
    let date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    let Y = date.getFullYear() + '-';
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
    let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
    // let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return Y + M + D + h + m;
  },
  /* 时间yyyy-MM-dd HH:mm:ss转为时间戳 */
  timeToTimestamp(time) {
    let timestamp = Date.parse(new Date(time).toString());
    //timestamp = timestamp / 1000; //时间戳为13位需除1000，时间戳为13位的话不需除1000
    console.log(time + "的时间戳为：" + timestamp);
    return timestamp;
    //2021-11-18 22:14:24的时间戳为：1637244864707
  },
  showPopup() {
    this.setData({
      show: true
    });
  },

  onClose() {
    this.setData({
      show: false
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(this.timeToTimestamp("2023-12-12 16:24"))
    // console.log(this.timestampToTime(1765368240000))
  },
  getinfo() {
    // wx.cloud.database().collection("send").get().then(res => {
    //   console.log(res)
    //   this.setData({
    //     list: res.data
    //   })
    // })
    wx.showLoading({
      title: '请稍候',
    })
    wx.cloud.callFunction({
      name: 'Get_List',
    }).then(res => {
      console.log(res)
      wx.hideLoading()
      this.setData({
        list: res.result.data
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  add(e) {
    if (wx.getStorageSync('user')) {
      var that = this
      console.log(e.currentTarget.dataset.index)

      let index = e.currentTarget.dataset.index
      let _openid = that.data.list[index]._openid
      let _id = that.data.list[index]._id
      let openid = wx.getStorageSync('openid')
      if (openid == _openid) {
        wx.showToast({
          title: '你是拼车发起者不可加入',
          icon: "none"
        })
        return
      }
      let tag = false
      for (var i = 0; i < that.data.list[index].arr.length; i++) {
        if (openid == that.data.list[index].arr[i].openid) {
          wx.showToast({
            title: '你已加入',
            icon: "none"
          })
          tag = true
          break
        }

      }
      if (tag == false) {
        let user = wx.getStorageSync('user')
        var action = {}
        action.name = user.nickName
        action.face = user.avatarUrl
        action.openid = openid
        action.leader = false
        let _ = wx.cloud.database().command
        wx.cloud.database().collection("send").doc(_id).update({
          data: {
            arr: _.unshift(action)
          }
        }).then(res => {
          console.log(res)
          wx.cloud.database().collection("myadd").add({
            data: {
              dataid: that.data.list[index]._id,
              title: that.data.list[index].title,
              phone: that.data.list[index].phone,
              time: that.data.list[index].time,
              talk: that.data.list[index].talk,
            }
          }).then(res => {
            console.log(res)
            wx.showToast({
              title: '加入成功！',
              icon: "success"
            })
            that.getinfo()
          })
        })
      }
    } else {
      wx.showToast({
        title: '请先登录',
        icon: "none"
      })
    }
  },
  detail(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../index/detail?id=' + id,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getinfo()
    this.setData({
      nowtime: Date.parse(new Date())
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
    this.getinfo()
  },


  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  navigateToPage: function () {
    wx.navigateTo({
      url: '../add/index',
      success: function (res) {},
      fail: function (res) {},
      complete: function (res) {},
    })
  }
})