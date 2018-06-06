var util = require('util')
var url = require('url')
var express = require('express')
var app = express()

// public下可放置图片资源文件
app.use(express.static(__dirname + '/public'))

// 路由转发，页面请求
app.get('/*.html', function (req, res) {
    res.sendFile(__dirname + "/view/" + req.path)
})

// 数据请求
app.get('/student/*', function (req, res) {
    var service = require('./service/student')
    service.getGrade(req, res)
})

// 其他请求，返回404
app.get('/*', function (req, res) {
    console.log("404: " + req.path)
    res.writeHead(404, {'Content-Type': 'text/html;charset=utf-8'})
    res.end()
})
 
var server = app.listen(8000, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("应用实例，访问地址为 http://%s:%s", host, port)
})