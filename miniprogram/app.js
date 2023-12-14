// app.js
App({
  onLaunch: function () {
    var that = this
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        env: 'cloud1-3g2owliv028af018',
        traceUser: true,
      });
      wx.showLoading({
        title: '加载中',
      })
      
      // setTimeout(function () {
      //   wx.hideLoading()
      // }, 2000)
      let openid = wx.getStorageSync('openid')
      if(!openid){
        wx.cloud.callFunction({
          name:"Get_openid",
          success(res){
            console.log(res)
            wx.setStorageSync('openid', res.result.openid)
            wx.cloud.database().collection("UserInfo").where({_openid:res.result.openid}).get().then(res=>{
              console.log(res)
              if(res.data.length!=0){
                that.globalData.userinfo = res.data[0]
                that.globalData.login = true
                console.log(that.globalData)
                wx.hideLoading()
              }
              else{
                wx.navigateTo({
                  url: '../login/index',
                })
                wx.hideLoading()
              }
            })
          }
        })
      }
      else{
        wx.cloud.database().collection("UserInfo").where({_openid:wx.getStorageSync('openid')}).get().then(res=>{
          console.log(res)
          if(res.data.length!=0){
            that.globalData.userinfo = res.data[0]
            that.globalData.login = true
            console.log(that.globalData)
            wx.hideLoading()
          }
          else{
            wx.navigateTo({
              url: '../login/index',
            })
            wx.hideLoading()
          }
        })
      }

    }

    this.globalData = {
      login:false,
      userinfo:{}
    };
  }
});
