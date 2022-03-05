const app = getApp()
var database = require("../../utils/data.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //article将用来存储towxml数据
    article: {},
    pageid: null,
    page: null,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    comments: null,
    currentCommentNum: 0,
    commentsHasData: false,
    commentsAllCount: 0,
    preCommitTime:null,
    inputComment:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var self = this;
    this.pageid = options.id
    this.setData({
      pageid: options.id
    })
    wx.showLoading({
      title: '加载中...',
    })

    database.getPageById(this.pageid).then(data => {
      if (data.result != null) {
        self.setData({
          page: data.result
        })
        let text = app.towxml(data.result.text,'markdown',{
          theme:'light',					// 主题，默认`light`
          events:{					// 为元素绑定的事件方法
            tap:(e)=>{
              console.log('tap',e);
            }
          }
        });
        // let text = app.towxml.toJson(data.result.text, 'markdown');
          console.log(data.result.text)
        //设置数据
        self.setData({
          article: text
        });
        wx.setNavigationBarTitle({
          title: data.result.title
        })
      }
      wx.hideLoading()
    })
    // 添加访问人数
    // database.addPageWatch(this.pageid)
    this.onReachBottom()
    // 获取随机壁纸
    // database.getRandomBg().then(function (data) {
    //   self.setData({
    //     bg: data.data
    //   })
    // });
  },

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
    wx.showLoading({
      title: '加载中...',
    })
    var that = this
    //到达底部在主动获取评论数据
    // database.getCommentByPageId(this.data.pageid, this.data.currentCommentNum).then(data => {
    //   var arr = data.result
    //   if (arr != null) {
    //     //如果数据存在
    //     if (that.data.comments == null) {
    //       that.setData({
    //         comments: arr,
    //         commentsHasData: true
    //       })
    //     } else {
    //       that.setData({
    //         comments: that.data.comments.concat(arr),
    //         commentsHasData: true
    //       })
    //     }
    //     that.setData({
    //       currentCommentNum: that.data.currentCommentNum + 1
    //     })
    //   }
    //   wx.hideLoading()
    // })
    // database.getCommentsCount(that.pageid).then(data => {
    //   that.setData({
    //     commentsAllCount: data.data
    //   })
    // })
  },
  goBack: function() {
    //返回首页
    wx.switchTab({
      url: '../../pages/index/index',
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: this.data.page.title,
      desc: this.data.page.desc,
      path: 'pages/page/page?id=' + this.data.pageid
    }
  },
  bindMessage:function(e){
    this.setData({
      inputComment:e.detail.value
    })
  },
  cleanInput: function () {
    // var setMessage = { sendInfo: this.data.userMessage }
    this.setData({
      inputComment:null
    })
  },
  addcomments: function(e) {
    var that = this
    wx.getSetting({
      success: function(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function(res) {
              // var comment = e.detail.value.inputComment
              var comment = that.data.inputComment

              if (comment == null || comment == '') {
                wx.showToast({
                  title: '请输入评论内容',
                })
              } else {
                var preCommitTime = that.data.preCommitTime
                if(preCommitTime != null){
                  var m = new Date().getMinutes()
                  if (m == preCommitTime){
                    wx.showToast({
                      title: '评论速度过快',
                    })
                    return;
                  }
                }
                database.addComment(that.data.pageid, comment, res.userInfo.avatarUrl, res.userInfo.nickName, res.userInfo.city).then(data => {
                  var obj = data.data
                  if (obj == null) {
                    wx.showToast({
                      title: '添加评论失败',
                    })
                  } else {
                    //添加评论成功
                    database.getCommentById(obj.objectId).then(data => {
                      if (that.data.comments != null){
                        //说明还没有下滑到底部.所以不提那家
                        var arr = []

                        arr.push(data.data)
                        that.setData({
                          comments: arr.concat(that.data.comments)
                        })
                      }
                      
                      that.setData({
                        commentsHasData: true
                      })
                      that.setData({
                        commentsAllCount: that.data.commentsAllCount + 1
                      })
                      
                      that.setData({
                        preCommitTime: new Date().getMinutes()
                      })

                      wx.showToast({
                        title: '评论成功!',
                      })

                      that.cleanInput()
                    })
                  }
                })
              }
            }
          })
        } else {
          console.log("还没有授权.")
          wx.showToast({
            title: '未能接收授权!',
          })
        }
      }
    })
  }
})