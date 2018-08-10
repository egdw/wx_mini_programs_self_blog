const app = getApp()
var database = require("../../utils/data.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    
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
    
  },
  openAdmin:function(){
    var username = wx.getStorageSync('name')
    var password = wx.getStorageSync('pwd')
    var self = this;
    if (username != '') {
      if (password != '') {
        database.login(username, password).then(function (data) {
          console.log(data)
          console.log(data.flag)

          if (data.flag == true) {
            console.log("登录成功")
            //如果登录成功
            //将登录信息加入缓存
            wx.setStorage({
              key: 'name',
              data: username,
            })
            wx.setStorage({
              key: 'pwd',
              data: password,
            })
            //进行跳转
            console.log("redirect")
            self.gosuccesspage()
          } else {
            wx.navigateTo({
              url: '../admin/login/login',
            })
          }
        })
      }
    }else{
      wx.navigateTo({
        url: '../admin/login/login',
      })
    }
   
  },
  gosuccesspage: function () {
    wx.navigateTo({
      url: '../admin/index/index',
    })
  }
})