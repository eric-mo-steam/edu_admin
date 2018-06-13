// 数据库mysql连接器
var conn = require('../database/connector')
//返回学生的未选的课程的全部信息
exports.scourse = function(req,res,cookies){
    res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'})
   if (cookies) {
            var sql = "select course.id,course.name,course.credit,teacher.name \
                from course,teacher where course.tid=teacher.id and course.id not in(\
                select cid from SC where sid = '"cookies.id"');"
                conn.query(sql, function(data){
                     console.log(data)
                    res.end(JSON.stringify(data))
                })
    } 
    else {
        // 没有指定的cookie
        var data = {errorCode:1,
        errorMassage:"没有指定的cookie"}
    }
}