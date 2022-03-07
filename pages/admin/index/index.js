const app = getApp()
var database = require("../../../utils/data.js")
Page({
  /**
   * 页面的初始数据
   */
  data: {
    files: [],
    currentImgUrl: null
  },
  chooseImage: function(e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });
        console.log(res)
        var tempFilePaths = res.tempFilePaths
        var file;
        for (let item of tempFilePaths) {
          console.log('item', item)
          wx.cloud.uploadFile({
            cloudPath: 'pic.png', // 上传至云端的路径
            filePath: item, // 小程序临时文件路径
            success: res => {
              // 返回文件 ID
              console.log(res.fileID)
              that.uploadFileSuccess(res.fileID)
            },
            fail: console.error
          })
        }
      }
    })
  },
  previewImage: function(e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },
  uploadFileSuccess: function(res) {
    var that = this
    // if (res.length > 0) {
      console.log(res)
      that.setData({
        currentImgUrl: res
      })
      console.log(that.data.currentImgUrl)
    // }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  pagesubmit: function(e) {
    console.log(e)
    var pagedesc = e.detail.value.pagedesc;
    var pagetext = e.detail.value.pagetext;
    var pagetitle = e.detail.value.pagetitle;
    var currentImgUrl = this.data.currentImgUrl
    if (currentImgUrl == null) {
      wx.showToast({
        title: '需要上传一张封面!',
      })
    } else {
      console.log(currentImgUrl)
      database.addPage(pagetitle,pagetext,pagedesc,currentImgUrl).then(data => {
        var result = data.result
        console.log(result)
      })
  
      wx.switchTab({
        url: '../../../pages/index/index',
      })
    }
  }
})