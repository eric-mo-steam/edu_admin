// 数据库mysql连接器
var conn = require('../database/connector')

exports.getGrade = function(req, res){
    res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'})

    var sql = 'select distinct * from student join user using(uid);'
    conn.query(sql, function(data){
        // console.log(data)
        res.end(JSON.stringify(data))
    })
}