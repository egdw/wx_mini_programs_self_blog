var Bmob = require('../../../utils/bmob.js');
Bmob.initialize("911fddd3ec026014736dec243f32cd1b", "ef59e6a393c711568bd2a732959b32ad");
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
          console.log('itemn', item)
          file = Bmob.File('pic.jpg', item);
        }
        file.save().then(res => {
          console.log(res.length);
          console.log(res);
          that.uploadFileSuccess(res)
        })
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
    if (res.length > 0) {
      that.setData({
        currentImgUrl: JSON.parse(res[0])
      })
      console.log(that.data.currentImgUrl)
    }
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
      const query = Bmob.Query('page');
      query.set("title", pagetitle)
      query.set("text", pagetext)
      query.set("desc", pagedesc)
      query.set("pic", {
        "__type": "File",
        "group": currentImgUrl.cdn,
        "url": currentImgUrl.url,
        "filename": currentImgUrl.filename
      })
      query.save().then(res => {
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
      wx.switchTab({
        url: '../../../pages/index/index',
      })
    }
  }
})