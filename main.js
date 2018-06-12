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

// 路由转发，页面请求
app.get('/*.html', function (req, res) {
    var data = login.validLogin(req, res)
    if (data) {
        res.sendFile(__dirname + "/view/" + req.path, function(err) {
            if (err) {
                urlNotFound(req, res);
            }
        })
    } else {
        // cookie不存在或者异常，则返回首页
        res.sendFile(__dirname + "/view/index.html")
    }
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
        {id : 101, name : '张三', sex : '男', major : '计算机科学与技术', grade : 90},
        {id : 102, name : '李四', sex : '男', major : '物联网工程', grade : 79},
        {id : 103, name : '王五', sex : '男', major : '计算机科学与技术', grade : 80},
        {id : 104, name : '丽君', sex : '女', major : '软件工程', grade : 91},
        {id : 105, name : '宋梅', sex : '女', major : '通信工程', grade : 90},
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