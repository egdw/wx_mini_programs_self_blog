
App({
  towxml:require('/towxml/index'),
  onLaunch: function () {
    //初始化数据
    //设置背景图片
    wx.setStorage({
      key: 'background_img',
      data: 'https://t2.picb.cc/2022/03/06/fFRWRu.jpg',
    })
    wx.setStorage({
      key: 'logo',
      data: 'https://t1.picb.cc/uploads/2018/08/08/Ju6enK.jpg',
    })
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              //获取当前的用户信息存放到数据库当中
              console.log(res)
              console.log(res.userInfo)
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  }
  // towxml: new Towxml()
})