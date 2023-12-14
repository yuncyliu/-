// pages/index/detail.js
const app  = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  //预览图片
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.list.image,
      current: e.currentTarget.dataset.url
    });
  },
  //跳转页面
  gochat(e) {
    console.log(e.currentTarget.dataset.id)
    if(this.data.tag){
      let name = e.currentTarget.dataset.name
      wx.navigateTo({
        url: '../chat/chat?id=' + e.currentTarget.dataset.id + '&name=' + name,
      })
    }
    else{
      wx.showToast({
        title: '未加入',
        icon:"error"
      })
    }

  },
  getinfo(sendid){
    wx.cloud.database().collection("send").doc(sendid).get().then(res => {
      console.log(res)
      let time = Date.parse(new Date());
      let endtime = res.data.time1 - time
      if(endtime==0||endtime<0){
        endtime = 0
      }
      this.setData({
        list: res.data,
        time:endtime
      })
    })
  },
  getchat(id){
    wx.cloud.database().collection("Groupchats").where({
      data_id: id
    }).get().then(res => {
      console.log(res)
      let arr = res.data[0]
      let openid = wx.getStorageSync('openid')
      let tag = false
      for (var i = 0; i < arr.member.length; i++) {
        if (arr.member[i].openid == openid) {
          tag = true
        }
      }
      return Promise.resolve({
        tag: tag,
        data: res.data
      })
    }).then(result => {
      wx.hideLoading()
      console.log(result)
      this.setData({
        Group: result.data[0],
        tag: result.tag
      })
    }).catch(err => {
      wx.hideLoading()
      console.error(err)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options.id)
    wx.showLoading({
      title: '请稍后',
    })
    this.getinfo(options.id)
    this.getchat(options.id)
  },
  add() {
    var that = this
    let _openid = that.data.list._openid
    let _id = that.data.list._id
    let openid = wx.getStorageSync('openid')
    if (openid == _openid) {
      wx.showToast({
        title: '你是拼车发起者不可加入',
        icon: "none"
      })
      return
    }
    let tag = false
    for (var i = 0; i < that.data.list.arr.length; i++) {
      if (openid == that.data.list.arr[i].openid) {
        wx.showToast({
          title: '你已加入拼车',
          icon: "none"
        })
        tag = true
        break
      }
    }
    if (tag == false) {
      var action = {}
      action.name = app.globalData.userinfo.nickName
      action.face = app.globalData.userinfo.avatarUrl
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
            dataid: that.data.list._id,
            title: that.data.list.title,
            type: that.data.list.type,
            time: that.data.list.time,
            talk: that.data.list.talk,
            image:that.data.list.image
          }
        }).then(res => {
          console.log(res)
          let chatinfo = that.data.Group.chatinfo
          let info ={
            input:app.globalData.userinfo.nickName+"加入了群聊",
            time:that.getnowtime(),
            type:2
          }
          chatinfo.push(info)
          let member = that.data.Group.member
          let user ={
            face:app.globalData.userinfo.avatarUrl,
            name:app.globalData.userinfo.nickName,
            openid:wx.getStorageSync('openid')
          }
          member.push(user)
          wx.cloud.database().collection("Groupchats").doc(that.data.Group._id).update({
            data:{
              chatinfo:chatinfo,
              member:member
            }
          }).then(res=>{
            console.log(res)
            wx.cloud.database().collection("MyGroup").add({
              data:{
                datasendid:that.data.list._id,
                data_id:that.data.Group._id,
                ledear:that.data.Group._openid,
                topname:that.data.Group.topname
              }
            }).then(res=>{
              console.log(res)
              wx.showToast({
                title: '加入成功！',
                icon: "success"
              })
              that.getinfo(_id)
              that.getchat(_id)
            })

          })
        })
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