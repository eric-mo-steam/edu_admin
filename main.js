var util = require('util')
var url = require('url')
var express = require('express')
var app = express()

// public下可放置图片资源文件
app.use(express.static(__dirname + '/public'))

// 路由转发，页面请求
app.get('/*.html', function (req, res) {
    res.sendFile(__dirname + "/view/" + req.path, function(err) {
        if (err) {
            urlNotFound(req, res);
        }
    })
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