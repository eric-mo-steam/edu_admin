var util = require('util')
var url = require('url')

var express = require('express')

var app = express()

// public下可放置图片资源文件
app.use(express.static(__dirname + '/public'))


app.get('/*.html', function (req, res) {
    res.sendFile(__dirname + "/view/" + req.path)
})


app.get('/*', function (req, res) {
    console.log("data:" + req.path)
    res.writeHead(200, {'Content-Type': 'text/json'})
    var response = {
      "first_name":'eric',
      "last_name":'mo'
    };
    res.end(JSON.stringify(response));
})
 
var server = app.listen(8080, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("应用实例，访问地址为 http://%s:%s", host, port)
})