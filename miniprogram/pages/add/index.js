// pages/fabu/fabu.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    minHour: 10,
    maxHour: 20,
    minDate: new Date().getTime(),
    maxDate: new Date(2030, 12, 30).getTime(),
    currentDate: new Date().getTime(),
    show: false,
    num: 1,
    talk:'',
    show1: false,
    time: "选择拼团截止时间",
    value: '选择',
    columns: ['外卖', '网购', '搭子', '其他'],
    imgList: [],
    fileIDs: [],
    chatname: ""
  },

  onInput(event) {
    console.log(event)
    let time = this.timestampToTime(event.detail)
    this.setData({
      currentDate: event.detail,
      time: time,
      show1: false,
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
  showPopup1() {
    this.setData({
      show1: true
    });
  },
  onClose1() {
    this.setData({
      show1: false
    });
  },
  onChange1(event) {
    console.log(event.detail);
    this.setData({
      num: event.detail
    })
  },
  onChange2(event) {
    console.log(event.detail);
    this.setData({
      value: event.detail.value
    })
  },
  title(event) {
    // event.detail 为当前输入的值
    console.log(event.detail);
    this.setData({
      title: event.detail
    })
  },
  phone(event) {
    // event.detail 为当前输入的值
    console.log(event.detail);
    this.setData({
      phone: event.detail
    })
  },
  chatname(event) {
    // event.detail 为当前输入的值
    console.log(event.detail);
    this.setData({
      chatname: event.detail
    })
  },
  talk(event) {
    // event.detail 为当前输入的值
    console.log(event.detail);
    this.setData({
      talk: event.detail
    })
  },
  send() {
    var that = this
    let user = wx.getStorageSync('message')
    if (that.data.title == "" || that.data.value == "选择" || that.data.time == "选择拼团截止时间"||
    that.data.chatname==''||that.data.talk==''|| that.data.num == "1") {
      wx.showToast({
        title: '你还没有填完信息哦',
        icon: "none"
      })
      return
    }
    wx.showModal({
      title: '提示',
      content: '确认发布',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '发布中...',
          })
          const promiseArr = []
          for (let i = 0; i < that.data.imgList.length; i++) {
            let filePath = that.data.imgList[i].tempFilePath
            let suffix = /\.[^\.]+$/.exec(filePath)[0]; // 正则表达式，获取文件扩展名
            //在每次上传的时候，就往promiseArr里存一个promise，只有当所有的都返回结果时，才可以继续往下执行
            promiseArr.push(new Promise((reslove, reject) => {
              wx.cloud.uploadFile({
                cloudPath: `cloudimg/${new Date().getTime() + suffix}`,
                filePath: filePath, // 文件路径
              }).then(res => {
                // get resource ID
                console.log("上传结果", res.fileID)
                that.setData({
                  fileIDs: that.data.fileIDs.concat(res.fileID)
                })
                reslove()
              }).catch(error => {
                console.log("上传失败", error)
              })
            }))
          }
          Promise.all(promiseArr).then(res => {
            var arr = []
            var action = {}
            action.name = app.globalData.userinfo.nickName
            action.face = app.globalData.userinfo.avatarUrl
            action.openid = wx.getStorageSync('openid')
            action.leader = true
            arr.push(action)
            wx.cloud.database().collection("send").add({
              data: {
                title: that.data.title,
                phone: that.data.phone,
                time: that.data.time,
                name: user.nickName,
                face: user.avatarUrl,
                talk: that.data.talk,
                num: that.data.num,
                time1: that.data.currentDate,
                fabutime: that.getnowtime(),
                SendTime:Date.parse(new Date()),
                arr: arr,
                image: that.data.fileIDs,
                type: that.data.value
              }
            }).then(res => {
              console.log(res)
              let datasendid = res._id
              let chatinfo = new Array()
              let msg ={}
              msg.input = "群聊创建成功，快来邀请朋友加入群聊吧！",
              msg.time = that.getnowtime(),
              msg.type = 2, //1：普通文字消息，2：成员加入群聊/创建群聊
              chatinfo.push(msg)
              let member = new Array()
              let info = {}
              info.face = app.globalData.userinfo.avatarUrl,
              info.name = app.globalData.userinfo.nickName,
              info.openid = wx.getStorageSync('openid')
              member.push(info)
              wx.cloud.database().collection("Groupchats").add({
                data: {
                  ledear: wx.getStorageSync('openid'),
                  topname: that.data.chatname,
                  chatinfo: chatinfo,
                  data_id: res._id,
                  member:member,
                  topface: app.globalData.userinfo.avatarUrl
                }
              }).then(res => {
                console.log(res)
                wx.cloud.database().collection("MyGroup").add({
                  data: {
                    datasendid:datasendid,
                    ledear: wx.getStorageSync('openid'),
                    topname: that.data.chatname,
                    data_id: res._id,
                  }
                }).then(res => {
                  wx.hideLoading()
                  wx.switchTab({
                    url: '../index/index',
                    success(res) {
                      wx.showToast({
                        title: '发布成功',
                        icon: 'success'
                      })
                    }
                  })
                })
              })
            })
          })
        }
      }
    })

  },
  //获取当前时间
  getnowtime() {
    var d = new Date();
    var month = d.getMonth() + 1;
    var date = d.getDate();
    var day = d.getDay();
    var hours = d.getHours();
    var minutes = d.getMinutes();
    var seconds = d.getSeconds();
    var ms = d.getMilliseconds();

    var curDateTime = d.getFullYear() + "-";
    if (month > 9) {
      curDateTime += month + "-"
    } else {
      curDateTime += month + "-"
    }
    if (date > 9) {
      curDateTime = curDateTime + date + " "
    } else {
      curDateTime = curDateTime + date + " "
    }
    if (hours > 9) {
      curDateTime = curDateTime + hours + ":"
    } else {
      curDateTime = curDateTime + hours + ":"
    }
    if (minutes > 9) {
      curDateTime = curDateTime + minutes
    } else {
      curDateTime = curDateTime + "0" + minutes
    }
    return curDateTime;
  },
  //用户点击上传照片
  chooseImage() {
    var that = this;
    wx.chooseMedia({
      mediaType: ['image'],
      maxDuration: 3 - that.data.imgList.length,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        console.log("选择图片成功", res)
        if (that.data.imgList.length != 0) {
          that.setData({
            imgList: that.data.imgList.concat(res.tempFiles)
          })

        } else {
          that.setData({
            imgList: res.tempFiles
          })
        }
      }
    })
  },
  //用户点击删除照片
  deleteImg(e) {
    wx.showModal({
      title: '提示',
      content: '要删除这张照片吗？',
      cancelText: '取消',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList
          })
        }
      }
    })
  },

  getnowtime() {
    var d = new Date();
    var month = d.getMonth() + 1;
    var date = d.getDate();
    var day = d.getDay();
    var hours = d.getHours();
    var minutes = d.getMinutes();
    var seconds = d.getSeconds();
    var ms = d.getMilliseconds();

    var curDateTime = d.getFullYear() + "-";
    if (month > 9) {
      curDateTime += month + "-"
    } else {
      curDateTime += month + "-"
    }
    if (date > 9) {
      curDateTime = curDateTime + date + " "
    } else {
      curDateTime = curDateTime + date + " "
    }
    if (hours > 9) {
      curDateTime = curDateTime + hours + ":"
    } else {
      curDateTime = curDateTime + hours + ":"
    }
    if (minutes > 9) {
      curDateTime = curDateTime + minutes
    } else {
      curDateTime = curDateTime + "0" + minutes
    }
    return curDateTime;
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