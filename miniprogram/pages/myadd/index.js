// pages/myadd/index.js
const db = wx.cloud.database()
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
  //退出
  exit(e) {
    let id = e.currentTarget.dataset.id
    let dataid = e.currentTarget.dataset.dataid
    wx.showModal({
      title: '提示',
      content: '确定退出？',
      complete: (res) => {
        if (res.confirm) {
          let openid = wx.getStorageSync('openid')
          let promise1 = new Promise((resolve, reject) => {
            db.collection("Groupchats").where({
              data_id: dataid
            }).get().then(res => {
              console.log(res)
              const newArray = res.data[0].member.filter(obj => obj.openid !== openid);
              const groupid = res.data[0]._id
              resolve({
                newArray,
                groupid
              });
            }).catch(error => {
              reject(error);
            });
          })
          promise1.then(({
            newArray
          }) => {
            return new Promise((resolve, reject) => {
              db.collection("Groupchats").where({
                data_id: dataid
              }).update({
                data: {
                  member: newArray
                }
              }).then(res => {
                resolve(res);
              }).catch(error => {
                reject(error);
              });
            });
          });
          promise1.then(({
            groupid
          }) => {
            return new Promise((resolve, reject) => {
              // 接下来可以将 dataIdFromPromise1 作为条件进行 promise3 的操作
              db.collection('MyGroup').where({
                data_id: groupid,
                _openid: wx.getStorageSync('openid')
              }).remove().then(res => {
                resolve(res)
              }).catch(err => {
                reject(err)
              })
            })
          });
          let promise2 = new Promise((resolve, reject) => {
            db.collection("send").doc(dataid).get().then(res => {
              const newArray = res.data.arr.filter(obj => obj.openid !== openid);
              resolve(newArray);
            }).catch(error => {
              reject(error);
            });
          })
          promise2.then(newArray => {
            return new Promise((resolve, reject) => {
              db.collection("send").doc(dataid).update({
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
          // let promise3 = new Promise((resolve, reject) =>{
          //   db.collection('MyGroup').where({data_id:groupid}).remove().then(res=>{
          //     resolve(res)
          //   }).catch(err=>{
          //     reject(err)
          //   })
          // })
          let promise4 = new Promise((resolve, reject) => {
            db.collection('myadd').where({
              _id: id,
              _openid: wx.getStorageSync('openid')
            }).remove().then(res => {
              resolve(res)
            }).catch(err => {
              reject(err)
            })
          })
          Promise.all([promise1, promise2, promise4])
            .then((results) => {
              console.log(results)
              wx.navigateBack({
                delta: 1,
                success(res) {
                  wx.showToast({
                    title: '退出成功！',
                  })
                }
              })
              // 所有异步操作都执行成功的处理代码
            })
            .catch((error) => {
              console.log(error)
              wx.showToast({
                title: '退出失败！',
                icon: "error"
              })
              // 任意一个异步操作出现错误时的处理代码
            })
        }
      }
    })
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