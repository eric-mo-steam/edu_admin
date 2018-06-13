var util = require('util')
var url = require('url')

var express = require('express')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser');

var encrypt = require('./service/encrypt')
var login = require('./service/login')

var app = express()

// public下可放置图片资源文件
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser());

app.get('*', function (req, res, next) {
    // 先用cookie验证登录
    var cookie = login.validLogin(req, res)
    if (cookie) {   // cookie正常
        next();
    } else {        // cookie不存在或者异常
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
    var service = require('./service/login')
    service.login(req, res)
})

// 数据请求
app.get('/student/*', function (req, res) {
    var service = require('./service/student')
    service.getGrade(req, res)
})

//课程信息
app.get('/course/*', function (req, res) {
    var service = require('./service/course')
    service.course(req, res)
})

app.get('/data', function(req, res) {
    var json = JSON.stringify([
        {rank : 1,id : 101, name : '张三',  sex : '男', major : '计算机科学与技术', grade : 91,cid :'CS1001'},
        {rank : 2,id : 102, name : '李四', sex : '男', major : '物联网工程', grade : 90,cid :'CS1001'},
        {rank : 3,id : 103, name : '王五', sex : '男', major : '计算机科学与技术', grade : 80,cid :'CS1001'},
        {rank : 4,id : 104, name : '丽君', sex : '女', major : '软件工程', grade : 79,cid :'CS1001'},
        {rank : 5,id : 105, name : '宋梅', sex : '女', major : '通信工程', grade : 68,cid :'CS1001'},
    ])
    res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'})
    res.end(json)
})

app.get('/course_select', function(req, res){
    var json = JSON.stringify([
        {id : 'CS1001', name : '数据结构', credit : 4, tname : '李晓鸿'},
        {id : 'CS1002', name : '计算机网络', credit : 4, tname : '王东'},
        {id : 'CS1003', name : '算法设计', credit : 5, tname : '姜文君'},
        {id : 'CS1004', name : '操作系统', credit : 4, tname : '肖德贵'},
        {id : 'CS1005', name : '操作系统', credit : 4, tname : '陈浩'}
    ])
    res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'})
    res.end(json)
})

app.get('/course_operate', function(req, res){
    var json = JSON.stringify([
        {id : 'CS1001', name : '数据结构', credit : 4},
        {id : 'CS1002', name : '计算机网络', credit : 4},
        {id : 'CS1003', name : '算法设计', credit : 5},
        {id : 'CS1004', name : '人工智能', credit : 4},
        {id : 'CS1005', name : '操作系统', credit : 4}
    ])
    res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'})
    res.end(json)
})

app.get('/course_view', function(req, res){
    var json = JSON.stringify([
        {id : 'CS1001', name : '数据结构', credit : 4, tname : '李晓鸿'},
        {id : 'CS1002', name : '计算机网络', credit : 4, tname : '王东'},
        {id : 'CS1003', name : '算法设计', credit : 5, tname : '姜文君'},
        {id : 'CS1004', name : '操作系统', credit : 4, tname : '肖德贵'}
    ])
    res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'})
    res.end(json)
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