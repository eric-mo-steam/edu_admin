// 数据库mysql连接器
var conn = require('../database/connector')
//返回学生的未选的课程的全部信息
exports.su_course = function(req,res,cookies){
    res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'})
    console.log("cookies"+cookies.id)
   if (cookies) {
            var sql = "select course.id,course.name,course.credit,teacher.name  tname  \
                from course,teacher where course.tid=teacher.id and course.id not in(\
                select cid from SC where sid = '"+cookies.id+"');"
                console.log("c_sql"+sql)
                conn.query(sql, function(data){
                    rSet=[]
                    for (x in data)
                    {
                        var tmp={

                            id : data[x].id, 
                            name : data[x].name ,
                            credit : data[x].credit,
                            tname : data[x].tname
                        }
                        rSet.push(tmp)
                    }
                    var json1 = JSON.stringify({
                        responseCode: 200, 
                        resultSet :rSet
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
//返回学生已选课情况
exports.s_course = function(req,res,cookies){
    res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'})
    console.log("cookies"+cookies.id)
   if (cookies) {
            var sql = "select course.id,course.name,course.credit,teacher.name  tname  \
                from course,teacher where course.tid=teacher.id and course.id  in(\
                select cid from SC where sid = '"+cookies.id+"');"
                console.log("c_sql"+sql)
                conn.query(sql, function(data){
                    rSet=[]
                    for (x in data)
                    {
                        var tmp={
                            id : data[x].id, 
                            name : data[x].name ,
                            credit : data[x].credit,
                            tname : data[x].tname
                        }
                        rSet.push(tmp)
                    }
                    var json1 = JSON.stringify({
                        responseCode: 200, 
                        resultSet :rSet
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