// pages/chat/chat.js
const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    chatinfo: [],
    inputValue: "",
    lei: 0,
    scrollTop: 0,
    member: [],
    show: false,
    img: [],
    voice: "",
    isimg: 0,
    is_clock: false,
    isPlay: true,
    isManager: '',
    info: {}
  },

  InputFocus(e) {
    this.setData({
      InputBottom: e.detail.height
    })
  },
  InputBlur(e) {
    this.setData({
      InputBottom: 0
    })
  },

  showModal(e) {
    console.log(e)
    let index = e.currentTarget.dataset.index
    let info = this.data.chatinfo[index]
    this.setData({
      modalName: e.currentTarget.dataset.target,
      info: info
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
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

  getInputValue(event) {
    console.log(event.detail.value)
    this.setData({
      inputValue: event.detail.value
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options)

    wx.setNavigationBarTitle({
      title: options.name
    })
    this.gettopchat(options.id)
    let openid = wx.getStorageSync('openid')
    this.setData({
      openid: openid,
      chatid: options.id,
    })

  },
  gettopchat(id) {
    wx.cloud.database().collection("Groupchats").doc(id).watch({
      onChange: this.onChange.bind(this),
      onError(err) {
        console.log(err)
      }
    })
  },
  onChange(e) {
    let that = this
    console.log(e)
    // var msg = that.data.chatinfo
    // msg.push(e.docs[0].chatinfo)
    that.setData({
      chatinfo: e.docs[0].chatinfo,
      member: e.docs[0].member,
      isManager: e.docs[0].ledear,
      sendId: e.docs[0].data_id,
      toView: `item${e.docs[0].chatinfo.length - 1}`
    })

  },
  //踢出群聊
  kick(e) {
    var that = this
    let openid = e.currentTarget.dataset.openid
    let name = e.currentTarget.dataset.name
    if(openid == wx.getStorageSync('openid')){
      wx.showToast({
        title: '不能踢出自己的账号',
        icon:"none"
      })
      return
    }
    wx.showModal({
      title: '提示',
      content: '确认踢出？',
      complete: (res) => {
        if (res.confirm) {
          let promise1 = new Promise((resolve, reject) => {
            db.collection("Groupchats").doc(that.data.chatid).get().then(res => {
              console.log(res)
              const newArray = res.data.member.filter(obj => obj.openid !== openid);
              resolve(newArray);
            }).catch(error => {
              reject(error);
            });
          })
          promise1.then(newArray => {
            return new Promise((resolve, reject) => {
              let info = {
                input: name + "已被管理员踢出群聊！",
                time: that.getnowtime(),
                type: 2
              }
              let _ = db.command
              db.collection("Groupchats").doc(that.data.chatid).update({
                data: {
                  member: newArray,
                  chatinfo: _.push(info)
                }
              }).then(res => {
                resolve(res);
              }).catch(error => {
                reject(error);
              });
            });
          });
          const promise2 = new Promise((resolve, reject) => {
            // 接下来可以将 dataIdFromPromise1 作为条件进行 promise3 的操作
            db.collection('MyGroup').where({
              data_id: that.data.chatid,
              _openid: openid
            }).remove().then(res => {
              resolve(res)
            }).catch(err => {
              reject(err)
            })
          })
          let promise3 = new Promise((resolve, reject) => {
            db.collection("send").doc(that.data.sendId).get().then(res => {
              const newArray = res.data.arr.filter(obj => obj.openid !== openid);
              resolve(newArray);
            }).catch(error => {
              reject(error);
            });
          })
          promise3.then(newArray => {
            return new Promise((resolve, reject) => {
              db.collection("send").doc(that.data.sendId).update({
                data: {
                  arr: newArray
                }
              }).then(res => {
                resolve(res);
              }).catch(error => {
                reject(error);
              });
            });
          });
          let promise4 = new Promise((resolve, reject) => {
            db.collection('myadd').where({
              dataid: that.data.sendId,
              _openid: openid
            }).remove().then(res => {
              resolve(res)
            }).catch(err => {
              reject(err)
            })
          })
          Promise.all([promise1, promise2, promise3, promise4])
            .then((results) => {
              console.log(results)
              wx.showToast({
                title: '踢出成功！',
              })
              // 所有异步操作都执行成功的处理代码
            })
            .catch((error) => {
              console.log(error)
              wx.showToast({
                title: '踢出失败！',
                icon: "error"
              })
              // 任意一个异步操作出现错误时的处理代码
            })
        }
      }
    })
  },
  publishComment() {
    var that = this
    if (that.data.inputValue == "") {
      wx.showToast({
        title: '内容不能为空！',
        icon: "none"
      })
    } else {
      let openid = wx.getStorageSync('openid')
      let input = that.data.inputValue
      let chatinfo = that.data.chatinfo
      let msg = {}
      msg.face = app.globalData.userinfo.avatarUrl,
        msg.name = app.globalData.userinfo.nickName,
        msg.input = input,
        msg.time = that.getnowtime(),
        msg.openid = openid,
        msg.type = 1,
        chatinfo.push(msg)
      console.log(chatinfo)

      wx.cloud.database().collection("Groupchats").doc(that.data.chatid).update({
          data: {
            chatinfo: chatinfo
          }
        })
        .then(res => {
          console.log(res)
          that.setData({
            isimg: false
          })
        })

      that.setData({
        chatinfo: chatinfo,
        inputValue: ""
      })
    }


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


  tip: function (msg) {
    wx.showModal({
      title: '提示',
      content: msg,
      showCancel: false
    })
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
    var that = this
    wx.cloud.database().collection("Groupchats").doc(that.data.chatid).update({
        data: {
          chatinfo: that.data.chatinfo
        }
      })
      .then(res => {
        console.log(res)
      })
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