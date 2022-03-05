// var Bmob = require('bmob.js');
// Bmob.initialize("911fddd3ec026014736dec243f32cd1b", "ef59e6a393c711568bd2a732959b32ad");
wx.cloud.init()
const db = wx.cloud.database()

/**
 * 管理员后台登录
 */
function login(username, password) {
  return new Promise((resolve, reject) => {
    const query = Bmob.Query("admin");
    query.equalTo("username", "==", username);
    query.equalTo("password", "==", password);
    query.find().then(res => {
      if (res[0] == null || res[0] == undefined) {
        resolve({
          flag: false
        })
      } else {
        resolve({
          flag: true
        })
      }
    }).catch(err => {
      resolve({
        flag: false
      })
    })
  })
}

/**
 * 根据页码获取文章
 */
function getPageByNum(num) {
  return new Promise((resolve, reject) => {
    db.collection("pages")
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
          console.log("查询到的单挑数据")
          console.log(res.data[0])
          resolve({
            result: res.data[0]
          })
        }
      }
    })
    // query.equalTo("objectId", "==", id)
    // query.find().then(res => {
      
    // })
  })
}

/**
 * 添加阅读数量
 */
function addPageWatch(id) {
  const query = Bmob.Query('page')
  query.get(id).then(res => {
    res.increment('watch')
    res.save()
  }).catch(err => {
    console.log(err)
  })
}

/**
 * pageid 文章id
 * num 当前的评论页码
 */
function getCommentByPageId(pageid, num) {
  return new Promise((resolve, reject) => {
    const query = Bmob.Query('Comments')
    query.equalTo("pageid", "==", pageid)
    query.skip(num * 20)
    query.limit(20)
    query.order("-createdAt");
    query.find().then(res => {
      var arr = []
      for (var i = 0; i < res.length; i++) {
        arr[i] = res[i]
      }
      if (res[0] == null || res[0] == undefined) {
        resolve({
          result: null
        })
      } else {
        resolve({
          result: arr
        })
      }
    })
  })
}

/**
 * 添加评论
 */
function addComment(pageid, msg, pic, name, city) {
  return new Promise((resolve, reject) => {
    const query = Bmob.Query('Comments');
    query.set("pageid", pageid)
    query.set("message", msg)
    query.set("pic", pic)
    query.set("nickname", name)
    query.set("provice", city)


    query.save().then(res => {
      resolve({
        data: res
      })
    }).catch(err => {
      resolve({
        data: null
      })
    })
  })
}

/**
 * 根据id获取评论数据
 */
function getCommentById(id) {
  return new Promise((resolve, reject) => {
    const query = Bmob.Query('Comments');
    query.get(id).then(res => {
      reslove({
        data: res
      })
    }).catch(err => {
      resolve({
        data: null
      })
    })
  })
}

/**
 * 获取某个文章下评论的数量
 */
function getCommentsCount(pageid) {
  return new Promise((resolve, reject) => {
    const query = Bmob.Query('Comments');
    query.equalTo("pageid", "==", pageid)
    query.count().then(res => {
      resolve({
        data: res
      })
    });
  })

}


/**
 * 随机获取一张背景图片
 */
function getRandomBg() {
  return new Promise((resolve, reject) => {

    //如果有缓存优先从缓存当中读取
    wx.getStorage({
      key: 'randomBg',
      success: function (res) {
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
        const query = Bmob.Query('bgs');
        //从bmob数据库中读取数据.
        query.select("pic");
        query.find().then(res => {
          var arr = []
          for (var i = 0; i < res.length; i++) {
            arr[i] = res[i].pic.url
          }
          if (res[0] != null && res[0] != undefined) {
            var randomNum = Math.floor(Math.random() * arr.length);
            wx.setStorage({
              key: 'randomBg',
              data: arr,
            })
            resolve({
              data: arr[randomNum]
            })
          }
        });
      }
    })



  });
 

}


//获取我的界面info数据
function getMeInfo(){
  return new Promise((resolve, reject) => {
    const query = Bmob.Query('me');
    query.find().then(res => {
      var arr = []
      for (var i = 0; i < res.length; i++) {
        arr[i] = res[i]
      }
      if (res[0] == null || res[0] == undefined) {
        resolve({
          result: null
        })
      } else {
        resolve({
          result: arr
        })
      }
    });
  })
}

module.exports.login = login
exports.getPageByNum = getPageByNum
exports.getPageById = getPageById
exports.addPageWatch = addPageWatch
exports.addComment = addComment
exports.getCommentByPageId = getCommentByPageId
exports.getCommentById = getCommentById
exports.getCommentsCount = getCommentsCount
exports.getRandomBg = getRandomBg
exports.getMeInfo = getMeInfo