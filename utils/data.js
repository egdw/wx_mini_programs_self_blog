var Bmob = require('bmob.js');
Bmob.initialize("911fddd3ec026014736dec243f32cd1b", "ef59e6a393c711568bd2a732959b32ad");

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
    const query = Bmob.Query("page");
    query.skip(num * 10)
    query.limit(10)
    query.order("-createdAt");
    query.find().then(res => {
      if (res[0] == null || res[0] == undefined) {
        resolve({
          result: null
        })
      } else {
        var arr = [];
        for (var i = 0; i < res.length; i++) {
          arr[i] = res[i]
        }
        resolve({
          result: arr
        })
      }
    }).catch(err => {
      resolve({
        result: null
      })
    })
  })
}

/**
 * 根据文章id来查找文章
 */
function getPageById(id) {
  return new Promise((resolve, reject) => {
    const query = Bmob.Query("page");
    query.equalTo("objectId", "==", id)
    query.find().then(res => {
      if (res[0] == null || res[0] == undefined) {
        resolve({
          result: null
        })
      } else {
        resolve({
          result: res[0]
        })
      }
    })
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
      for(var i =0;i<res.length;i++){
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
      resolve({ data: res})
    }).catch(err => {
      resolve({ data: null })
    })
  })
}

/**
 * 根据id获取评论数据
 */
function getCommentById(id){
  return new Promise((reslove,reject) => {
    const query = Bmob.Query('Comments');
    query.get(id).then(res => {
      reslove({data:res})
    }).catch(err => {
      reslove({ data: null })
    })
  })
}

/**
 * 获取某个文章下评论的数量
 */
function getCommentsCount(pageid){
  return new Promise((reslove,reject)=>{
    const query = Bmob.Query('Comments');
    query.equalTo("pageid", "==", pageid)
    query.count().then(res => {
      reslove({ data: res})
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