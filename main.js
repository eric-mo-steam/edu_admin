var util = require('util')
var url = require('url')
var express = require('express')
var bodyParser = require('body-parser')
var app = express()

// public下可放置图片资源文件
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

// 路由转发，页面请求
app.get('/*.html', function (req, res) {
    res.sendFile(__dirname + "/view/" + req.path, function(err) {
        if (err) {
            urlNotFound(req, res);
        }
    })
})

app.post('/login', function(req, res) {
    var userType = req.body.userType
    if (userType) {
        if (userType == 0) {
            res.sendFile(__dirname + "/view" + "/admin/index.html")
        } else if (userType == 1) {
            res.sendFile(__dirname + "/view" + "/student/index.html")
        } else if (userType == 2) {
            res.sendFile(__dirname + "/view" + "/teacher/index.html")
        }
    }
})

// 数据请求
app.get('/student/*', function (req, res) {
    var service = require('./service/student')
    service.getGrade(req, res)
})

//登陆
app.get('/Login/*', function (req, res) {
    var service = require('./service/Login')
    service.Login(req, res)
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
    res.writeHead(500, {'Content-Type': 'text/html;charset=utf-8'})
    res.end()
}

function urlNotFound(req, res) {
    console.log("404: " + req.path)
    res.writeHead(404, {'Content-Type': 'text/html;charset=utf-8'})
    res.end()
}