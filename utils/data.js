wx.cloud.init()
const db = wx.cloud.database()

/**
 * 管理员后台登录
 */
function login(username, password) {
  console.log("username:",username)
  console.log("password:",password)
  return new Promise((resolve, reject) => {
    db.collection("admin")
    .where({
      username:db.command.eq(username),
      password:db.command.eq(password)
    }).get({
      success:function(res){
        console.log("登录结果")
        console.log(res)
        if (res.data[0] == null || res.data[0] == undefined) {
          resolve({
            flag: false
          })
        } else {
          resolve({
            flag: true
          })
        }
      }
    })
  })
}
function dateFormat(fmt, date) {
  let ret;
  const opt = {
      "Y+": date.getFullYear().toString(),        // 年
      "m+": (date.getMonth() + 1).toString(),     // 月
      "d+": date.getDate().toString(),            // 日
      "H+": date.getHours().toString(),           // 时
      "M+": date.getMinutes().toString(),         // 分
      "S+": date.getSeconds().toString()          // 秒
      // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };
  for (let k in opt) {
      ret = new RegExp("(" + k + ")").exec(fmt);
      if (ret) {
          fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
      };
  };
  return fmt;
}
/**
 * 根据页码获取文章
 */
function getPageByNum(num) {
  return new Promise((resolve, reject) => {
    db.collection("pages")
    .orderBy("createdAt","desc")
    .skip(num*10)
    .limit(10)
    .get({
      success:function(res){
        if(res.data.length == 0){
          resolve({
            result: null
          })
        }else{
          var arr = [];
          for (var i = 0; i < res.data.length; i++) {
            arr[i] = res.data[i]
            if(arr[i].createdAt!=null){
              arr[i].createdAt = dateFormat("YYYY-mm-dd HH:MM:SS",arr[i].createdAt)
            }else{
              arr[i].createdAt = "未知时间"
            }
            // console.log(dateFormat("YYYY-mm-dd HH:MM:SS",arr[i].createdAt))
          }
          resolve({
            result: arr
          })
        }
      }
    });
  })
}

/**
 * 根据文章id来查找文章
 */
function getPageById(id) {
  return new Promise((resolve, reject) => {
    db.collection("pages")
    .where({
      _id:db.command.eq(id)
    }).get({
      success:function(res){
        if (res.data[0] == null || res.data[0] == undefined) {
          resolve({
            result: null
          })
        } else {
          if(res.data[0].createdAt!=null){
            res.data[0].createdAt = dateFormat("YYYY-mm-dd HH:MM:SS",res.data[0].createdAt)
          }else{
            res.data[0].createdAt = "未知时间"
          }
          resolve({
            result: res.data[0]
          })
        }
      }
    })
  })
}

/**
 * 添加阅读数量
 */
function addPageWatch(id) {
  db.collection("pages").doc(id).update({
    watch:db.command.inc(1)
  })
}

/**
 * pageid 文章id
 * num 当前的评论页码
 */
function getCommentByPageId(pageid, num) {
  return new Promise((resolve, reject) => {
    db.collection("comments")
    .where({
      pageid:db.command.eq(pageid)
    })
    .skip(num * 20)
    .limit(20)
    .orderBy("createdAt","asc")
    .get({
      success:function(res){
        var arr = []
        for (var i = 0; i < res.data.length; i++) {
          arr[i] = res.data[i]
        }
        if (res.data[0] == null || res.data[0] == undefined) {
          resolve({
            result: null
          })
        } else {
          resolve({
            result: arr
          })
        }
      }
    })
  })
}

/**
 * 添加评论
 */
function addComment(pageid, msg, pic, name, city) {
  return new Promise((resolve, reject) => {
    db.collection("comments").add({
      data:{
        pageid:pageid,
        message:msg,
        pic:pic,
        nickname:name,
        provice:city,
        createdAt:db.serverDate()
      },
      success:function(res){
        resolve({
          data: res
        })
      }
    })
  })
}

/**
 * 根据id获取评论数据
 */
function getCommentById(id) {
  return new Promise((resolve, reject) => {
    db.collection("comments")
    .where({_id:db.command.eq(id)})
    .get({
      success:function(res){
        reslove({
          data: res.data
        })
      }
    })
  })
}

/**
 * 获取某个文章下评论的数量
 */
function getCommentsCount(pageid) {
  return new Promise((resolve, reject) => {
    db.collection("comments")
    .where({pageid:db.command.eq(pageid)})
    .count({
      success:function(res){
        resolve({
          data: res.total
        })
      }
    })
  })

}


/**
 * 随机获取一张背景图片
 */
function getRandomBg() {
  return new Promise((resolve, reject) => {

    //如果有缓存优先从缓存当中读取
    console.log("如果有缓存优先从缓存当中读取")
    wx.getStorage({
      key: 'randomBg',
      success: function (res) {
        console.log("有图片缓存")
        if (res.data != null && res.data != undefined) {
          var randomNum = Math.floor(Math.random() * res.data.length);
          resolve(
            {
              data: res.data[randomNum]
            }
          )
        }
      },
      fail: function () {
        console.log("没有数据")
      
        db.collection("bgs").get({
          success:function(res){
            console.log("图片请求成功")
            console.log(res)
            var arr = []
            for (var i = 0; i < res.data.length; i++) {
              arr[i] = res.data[i].pic
            }
            if (res.data[0] != null && res.data[0] != undefined) {
              var randomNum = Math.floor(Math.random() * arr.length);
              wx.setStorage({
                key: 'randomBg',
                data: arr,
              })
              console.log("查询到的randomnum",randomNum)
              console.log("结果：",arr)
              resolve({
                data: arr[randomNum]
              })
            }
          },fail:function(res){
            console.log("请求失败")
            console.log(res)
          }
        })
      }
    })
  });
}


//获取我的界面info数据
function getMeInfo(){
  return new Promise((resolve, reject) => {
    db.collection("me").get({
      success:function(res){
        var arr = []
        for (var i = 0; i < res.data.length; i++) {
          arr[i] = res.data[i]
        }
        if (res.data[0] == null || res.data[0] == undefined) {
          resolve({
            result: null
          })
        } else {
          resolve({
            result: arr
          })
        }
      }
    })
  })
}


//获取我的界面info数据
function addPage(title,text,desc,pic){
  return new Promise((resolve, reject) => {
    db.collection("pages")
    .add({
      data:{
        title:title,
        text:text,
        desc:desc,
        pic:pic,
        watch:0,
        createdAt:db.serverDate()
      }
    })
  })
}

module.exports.login = login
exports.getPageByNum = getPageByNum
exports.getPageById = getPageById
exports.addPageWatch = addPageWatch
exports.addComment = addComment
exports.addPage = addPage
exports.getCommentByPageId = getCommentByPageId
exports.getCommentById = getCommentById
exports.getCommentsCount = getCommentsCount
exports.getRandomBg = getRandomBg
exports.getMeInfo = getMeInfo