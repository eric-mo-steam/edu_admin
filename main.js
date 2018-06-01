var util = require('util')
var url = require('url')
var express = require('express')

// 数据库mysql连接器
var conn = require('./database/connector')

var app = express()

// public下可放置图片资源文件
app.use(express.static(__dirname + '/public'))

// 路由转发，页面请求
app.get('/*.html', function (req, res) {
    res.sendFile(__dirname + "/view/" + req.path)
})

// 数据请求
app.get('/user', function (req, res) {
    console.log("data:" + req.path)
    res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'})

    var sql = 'select distinct * from student join user using(uid);'
    conn.query(sql, function(data){
        console.log(data)
        res.end(JSON.stringify(data))
    })
})

// 其他请求，返回404
app.get('/*', function (req, res) {
    console.log("404: " + req.path)
    res.writeHead(404, {'Content-Type': 'text/html'})
    res.end()
})
 
var server = app.listen(8000, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("应用实例，访问地址为 http://%s:%s", host, port)
})