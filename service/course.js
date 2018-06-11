// 数据库mysql连接器
var conn = require('../database/connector')
//返回课程的全部信息
exports.course = function(req,res){
    res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'})
   var sql = 'select distinct * from course;'
  
    conn.query(sql, function(data){
        res.end(JSON.stringify(data))
    })
}