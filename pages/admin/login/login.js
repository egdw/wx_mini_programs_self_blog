//login.js
//获取应用实例
var app = getApp()
var database = require("../../../utils/data.js")
Page({
  data: {
    userInfo: {},
    userN: '',
    passW: '',
    id_token: '',
    focus: false,
    responseData: '',
    boo: false
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '/pages/logs/logs'
    })
  },
  userNameInput: function (e) {
    this.setData({
      userName: e.detail.value
    })
  },
  userPasswordInput: function (e) {
    this.setData({
      userPassword: e.detail.value
    })
    console.log(e.detail.value)
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var name = wx.getStorageSync('name')
    console.log(name)
    var pwd = wx.getStorageSync('pwd')
    if (name != '') {
      if (pwd != '') {
        this.login(name,pwd)
      }
    }
  },
  //用户名和密码输入框事件
  userNameInput: function (e) {
    this.setData({
      userN: e.detail.value
    })
  },
  passWordInput: function (e) {
    this.setData({
      passW: e.detail.value
    })
  },
  //登录按钮点击事件，调用参数要用：this.data.参数；
  //设置参数值，要使用this.setData({}）方法
  loginBtnClick: function (a) {
    var that = this
    if (this.data.userN.length == 0 || this.data.passW.length == 0) {
      wx.showModal({
        title: '温馨提示：',
        content:'用户名或密码不能为空！',
        showCancel:false
      })
    } else {
      this.login(this.data.userN, this.data.passW)     
    }
  },
  login:function(username,password){
    // const query = Bmob.Query('admin');
    var self = this;
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
      }else{
        console.log("登录失败")
        //清空数据
        wx.setStorage({
          key: 'name',
          data: '',
        })
        wx.setStorage({
          key: 'pwd',
          data: '',
        })
      }
    })
  },
  gosuccesspage:function(){
    wx.redirectTo({
      url: '../index/index',
    })
  }
})
