var util = require('util')
var url = require('url')

var express = require('express')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser');

var login = require('./service/login')
var CookieOp = require('./util/cookieOp')

var cop = new CookieOp()
var app = express()

// public下可放置图片资源文件
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser("abg146"));

app.get('*', function (req, res, next) {
    console.log('Acess: ' + req.url)
    // 将请求和响应传给cookie操作对象
    cop.set(req, res)
    // 先用验证cookie是否有效
    if (cop.validCookies() || req.url === '/login'){
        // 有效，则传递给下一个路由
        console.log("有效")
        next();
    } else {  // cookie不存在或者异常
        console.log("无效")
        var regx = /^.*\.html$/
        if (regx.test(req.url)) {
            // 请求的是页面，返回首页
            home(req, res)
        } else {
            // 请求的是数据，返回提示登录失效的json
            unlogin(req, res)
        }
    }
})

app.post('*', function (req, res, next) {
    console.log('Acess: ' + req.url)
    // 将请求和响应传给cookie操作对象
    cop.set(req, res)
    console.log(cop.getCookies())
    // 先用验证cookie是否有效
    if (cop.validCookies() || req.url === '/login'){
        // 有效，则传递给下一个路由
        next();
    } else {  // cookie不存在或者异常
        var regx = /^.*\.html$/
        if (regx.test(req.url)) {
            // 请求的是页面，返回首页
            home(req, res)
        } else {
            // 请求的是数据，返回提示登录失效的json
            unlogin(req, res)
        }
    }
})

// 路由转发，页面请求
app.get('/*.html', function (req, res) {
    res.sendFile(__dirname + "/view/" + req.path, function(err) {
        if (err) {
            urlNotFound(req, res);
        }
    })
})

app.post('/login', function(req, res) {
    // 将请求和响应传给cookie操作对象
    cop.set(req, res)
    var service = require('./service/login')
    service.login(req, res, cop)
})
//查询选秀课程的学生
//完成修改
app.get('/teacher/course_grade_list', function(req, res) {
    cop.set(req, res)
    var cookies = cop.getCookies()
    console.log(cookies.cid)    // 课程id
    var service = require('./service/teacher')
    service.course_grade_list(req, res, cookies)
 //   var json = JSON.stringify([
    //     {rank : 1,id : 101, name : '张三',  sex : '男', major : '计算机科学与技术', grade : 91,cid :'CS1001'},
    //     {rank : 2,id : 102, name : '李四', sex : '男', major : '物联网工程', grade : 90,cid :'CS1001'},
    //     {rank : 3,id : 103, name : '王五', sex : '男', major : '计算机科学与技术', grade : 80,cid :'CS1001'},
    //     {rank : 4,id : 104, name : '丽君', sex : '女', major : '软件工程', grade : 79,cid :'CS1001'},
    //     {rank : 5,id : 105, name : '宋梅', sex : '女', major : '通信工程', grade : 68,cid :'CS1001'},
    // ])
    // res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'})
    // res.end(json)
})
//更新成绩
//修改完成
app.post('/teacher/update_grade', function(req, res) {
    console.log(req.body) // 成绩名单
    cop.set(req, res)
    var service = require('./service/teacher')
    service.update_grade(req, res, cop.getCookies())
    // var json = JSON.stringify({
    //     responseCode: 200
    // })
    // res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'})
    // res.end(json)
})
//老师带的课
//修改成功
app.get('/teacher/course_teach_list', function(req, res){
    cop.set(req, res)
    var service = require('./service/teacher')
    service.course_teach_list(req, res, cop.getCookies())
    // var json = JSON.stringify({
    //     responseCode: 200, 
    //     resultSet : [
    //         {id : 'CS1001', name : '数据结构', credit : 4},
    //         {id : 'CS1002', name : '计算机网络', credit : 4},
    //         {id : 'CS1003', name : '算法设计', credit : 5},
    //         {id : 'CS1004', name : '人工智能', credit : 4},
    //         {id : 'CS1005', name : '操作系统', credit : 4}
    //     ]
    // })
    // res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'})
    // res.end(json)
})
//老师个人信息
//修改完成
app.get('/teacher/personal_info', function(req, res) {
    cop.set(req, res)
    var service = require('./service/teacher')
    service.personal_info(req, res, cop.getCookies())

    // var json = JSON.stringify({
    //     responseCode: 200, 
    //     resultSet : {
    //         id : 'T001',
    //         name : '王伟胜'
    //     }
    // })
    // res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'})
    // res.end(json)
})

//用来将课程号插入cookie，方便查询选修课程的学生
app.post('/teacher/save_course_id', function(req, res) {
    cop.set(req, res)
    console.log(req.body.cid + " <>")
    cop.append('cid', req.body.cid)
    res.end()
})

//修改完成
//学生个人信息
app.get('/student/personal_info', function(req, res) {   
    cop.set(req, res)
    var service = require('./service/student')
    service.personal_info(req, res, cop.getCookies())

    // var json = JSON.stringify({
    //     responseCode: 200, 
    //     resultSet : {
    //         id : 'S101',
    //         name : '张三'
    //     }
    // })
    // res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'})
    // res.end(json)
})
//返回学生未选课情况
//我修改了-并且成功了-许飞（这条注释可删）
app.get('/student/course_unselected_list', function(req, res){
    // 将请求和响应传给cookie操作对象
    cop.set(req, res)
    var service = require('./service/course')
    service.su_course(req, res, cop.getCookies())
    //测试用例
    // var json = JSON.stringify({
    //     responseCode: 200, 
    //     resultSet : [
    //         {id : 'CS1001', name : '数据结构', credit : 4, tname : '李晓鸿'},
    //         {id : 'CS1002', name : '计算机网络', credit : 4, tname : '王东'},
    //         {id : 'CS1003', name : '算法设计', credit : 5, tname : '姜文君'},
    //         {id : 'CS1004', name : '操作系统', credit : 4, tname : '肖德贵'},
    //         {id : 'CS1005', name : '操作系统', credit : 4, tname : '陈浩'}
    //     ]
    // })
    // console.log(json)
    //    res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'})
    // res.end(json)
})
//选课功能
//完成-可改进
app.post('/student/select_course', function(req, res){
    // 将请求和响应传给cookie操作对象
    cop.set(req, res)
    var cookies = cop.getCookies()
    console.log(req.body.cid)
    var service = require('./service/student')
    service.select_course(req, res,cookies)
    // var json = JSON.stringify({
    //     responseCode: 200
    // })
    // res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'})
    // res.end(json)
})

//返回学生已选课情况
//完成
app.get('/student/course_selected_list', function(req, res){
    // 将请求和响应传给cookie操作对象
    cop.set(req, res)
    var service = require('./service/course')
    service.s_course(req, res, cop.getCookies())
    // var json = JSON.stringify({
    //     responseCode: 200, 
    //     resultSet : [
    //         {id : 'CS1001', name : '数据结构', credit : 4, tname : '李晓鸿'},
    //         {id : 'CS1002', name : '计算机网络', credit : 4, tname : '王东'},
    //         {id : 'CS1003', name : '算法设计', credit : 5, tname : '姜文君'},
    //         {id : 'CS1004', name : '操作系统', credit : 4, tname : '肖德贵'}
    //     ]
    // })
    // res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'})
    // res.end(json)
})
//退课操作
//完成
app.post('/student/drop_course', function(req, res){
    cop.set(req, res)
    var service = require('./service/student')
    service.drop_course(req, res, cop.getCookies())
    console.log("退课"+req.body.cid)   // 退选的课程号

    // var json = JSON.stringify({
    //     responseCode: 200, 
    // })
    // res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'})
    // res.end(json)
})
//学生查询成绩
//完成
app.get('/student/course_grade_list', function(req, res){
    cop.set(req, res)
    var cookies = cop.getCookies()
    console.log(cookies.id)    // 根据学生id
    var service = require('./service/student')
    service.course_grade_list(req, res, cop.getCookies())
    // var json = JSON.stringify({
    //     responseCode: 200, 
    //     resultSet : [
    //         {id : 'CS1001', name : '数据结构', credit : 4, tname : '李晓鸿', grade : 90},
    //         {id : 'CS1002', name : '计算机网络', credit : 4, tname : '王东', grade : 89},
    //         {id : 'CS1003', name : '算法设计', credit : 5, tname : '姜文君', grade : 78},
    //         {id : 'CS1004', name : '操作系统', credit : 4, tname : '肖德贵', grade : 91}
    //     ]
    // })
    // res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'})
    // res.end(json)
})
//显示全部学生
//完成
app.get('/admin/student_list', function(req, res){
    cop.set(req, res)
    var service = require('./service/admin')
    service.student_list(req, res, cop.getCookies())
    // var json = JSON.stringify({
    //     responseCode: 200, 
    //     resultSet : [
    //         {id : 'S101', name : '张三', sex : '男', major: '计算机科学与技术'},
    //         {id : 'S102', name : '李四', sex : '男', major: '计算机科学与技术'},
    //         {id : 'S103', name : '王五', sex : '男', major: '计算机科学与技术'}
    //     ]
    // })
    // res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'})
    // res.end(json)
})
//添加学生
//完成-可改进
app.post('/admin/save_student', function(req, res) {
    console.log(req.body)
    cop.set(req, res)
    var service = require('./service/admin')
    service.save_student(req, res, cop.getCookies())
    // var json = JSON.stringify({
    //     responseCode: 200
    // })
    // res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'})
    // res.end(json)
})
//删除学生
//完成
app.post('/admin/delete_student', function(req, res) {
    console.log(req.body.sid)  
    cop.set(req, res)
    var service = require('./service/admin')
    service.delete_student(req, res, cop.getCookies())
    // res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'})
    // res.end(json)
})

//返回老师名单
//完成
app.get('/admin/teacher_list', function(req, res){
    cop.set(req, res)
    var service = require('./service/admin')
    service.teacher_list(req, res, cop.getCookies())
    // var json = JSON.stringify({
    //     responseCode: 200, 
    //     resultSet : [
    //         {id : 'T001', name : '张三', dept: '计算机科学系'},
    //         {id : 'T002', name : '李四', dept: '计算机工程系'},
    //         {id : 'T003', name : '王五', dept: '软件工程系'}
    //     ]
    // })
    // res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'})
    // res.end(json)
})
//添加老师信息
//完成
app.post('/admin/save_teacher', function(req, res) {
    cop.set(req, res)
    console.log("c_body")
    console.log(req.body) 
    var service = require('./service/admin')
    service.save_teacher(req, res, cop.getCookies())
    // cop.set(req, res)
    // console.log(req.body)
    // var json = JSON.stringify({
    //     responseCode: 200
    // })
    // res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'})
    // res.end(json)
})

app.post('/admin/delete_teacher', function(req, res) {
    cop.set(req, res)
    console.log("c_body")
    console.log(req.body) 
    var service = require('./service/admin')
    service.delete_teacher(req, res, cop.getCookies())
    // console.log(req.body.tid)   // 课程id
    // res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'})
    // res.end(json)
})
//全部课程列表

app.get('/admin/course_list', function(req, res){
    cop.set(req, res)
    var service = require('./service/admin')
    service.course_list(req, res, cop.getCookies())
    // var json = JSON.stringify({
    //     responseCode: 200, 
    //     resultSet : [
    //         {id : 'CS001', name : '算法导论', credit: 4, tname: '姜文君'},
    //         {id : 'CS001', name : '数据库原理', credit: 5, tname: '王伟胜'},
    //         {id : 'CS001', name : '计算机网络', credit: 3, tname: '吴迪'}
    //     ]
    // })
    // res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'})
    // res.end(json)
})
//添加课程
//完成
app.post('/admin/save_course', function(req, res) {
    cop.set(req, res)
    var service = require('./service/admin')
    console.log("c_body")
    console.log(req.body) 
    service.save_course(req, res, cop.getCookies())
    // cop.set(req, res)
    // console.log(req.body)
    // var json = JSON.stringify({
    //     responseCode: 200
    // })
    // res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'})
    // res.end(json)
})
//删除课程信息
//完成
app.post('/admin/delete_course', function(req, res) {
    console.log(req.body.cid)   // 课程id
    cop.set(req, res)
    var service = require('./service/admin')
    console.log("c_body")
    console.log(req.body) 
    service.delete_course(req, res, cop.getCookies())
    // res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'})
    // res.end(json)
})


// 其他请求，返回404
app.get('/*', function (req, res) {
    urlNotFound(req, res);
})

// 其他的POST表单请求，返回500
app.post('/*', function (req, res) {
    badRequest(req, res);
})
 
var server = app.listen(8000, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("应用实例，访问地址为 http://%s:%s", host, port)
})

function badRequest(req, res) {
    console.log("500: " + req.path)
    res.status(500).end();
}

function urlNotFound(req, res) {
    console.log("404: " + req.path)
    res.status(404).end();
}

function unlogin(req, res) {
    var json = JSON.stringify({
        responseCode : 900, responseMsg : '登录失效，请刷新重试'
    })
    res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'})
    res.end(json)
}

function home(req, res) {
    res.sendFile(__dirname + "/view/index.html")
}