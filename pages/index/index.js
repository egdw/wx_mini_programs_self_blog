//index.js
//获取应用实例
const app = getApp()
var database = require("../../utils/data.js")
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    pages: [{
      title: '数据加载中...',
      desc: '正在加载..请稍等...'
    }],
    background_img: null,
    logo: null,
    currentnum: 0
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function() {
    var self = this;
    // database.getRandomBg().then(function(data) {
    //   self.setData({
    //     bg: data.data
    //   })
    // });
  },
  pageClick: function(e) {
    console.log(e)
    wx.navigateTo({
      url: '../page/page?id=' + e.currentTarget.dataset.id,
    })
  },
  onShareAppMessage: function() {
    return {
      title: '恶搞大王的博客',
      desc: '欢迎来到恶搞大王的博客!',
      path: 'pages/index/index'
    }
  },
  onShow: function() {
    this.setData({
      currentnum: 0
    })
    this.getPages()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    console.log("pull")
    // this.getPages()
  },
  getPages: function() {
    var self = this;
    database.getPageByNum(this.data.currentnum).then(function(data) {
      if (data.result != null) {
        console.log("index.js得到数据")
        console.log(data.result)
        self.data.pages = data.result
        self.setData({
          pages: self.data.pages
        })
        console.log(self.pages)
      }
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this
    this.setData({
      currentnum: that.data.currentnum + 1
    })
    wx.showLoading({
      title: '加载中...',
    })
    database.getPageByNum(this.data.currentnum).then(function(data) {
      if (data.result != null) {
        that.setData({
          pages: that.data.pages.concat(data.result)
        })
        wx.hideLoading()
      } else {
        wx.hideLoading()
        wx.showToast({
          title: '到底了...',
        })
      }
    })
  },
})