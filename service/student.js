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
//学生信息
exports.personal_info = function(req,res,cookies){
    res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'})
    console.log("cookies"+cookies.id)
   if (cookies) {
        var sql = "select distinct id,name from student where id ='"+cookies.id+"';"
        console.log("c_sql"+sql)
        conn.query(sql, function(data){
            var json1 = JSON.stringify({
                responseCode: 200, 
                resultSet : {
                    id : data[0].id,
                    name : data[0].name
                }
            })
            console.log(json1);
            res.end(json1)
        })
    } 
    else {
        // 没有指定的cookie
        var data = {errorCode:1,
        errorMassage:"没有指定的cookie"}
    }
}