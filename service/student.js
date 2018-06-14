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

//选课-可改进
exports.select_course = function(req,res,cookies){
    res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'})
    console.log("cookies"+cookies.id)
    console.log(req.body) 
   if (cookies) {
       for(i in req.body){
            var sql = "insert into sc values('"+req.body.cid+"','"+cookies.id+"',null);"
            console.log("c_sql"+sql)
            conn.query(sql, function(data){
                var json1 = JSON.stringify({
                    responseCode: 200, 
                })
                console.log(json1);
                res.end(json1)
            })
       }
        
    } 
    else {
        // 没有指定的cookie
        var data = {errorCode:1,
        errorMassage:"没有指定的cookie"}
    }
}
//退课
exports.drop_course = function(req,res,cookies){
    res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'})
    console.log("cookies"+cookies.id)
    console.log(req.body) 
   if (cookies) {
       for(i in req.body){
            var sql = "delete from sc where cid='"+req.body.cid+"' and sid='"+cookies.id+"';"
            console.log("c_sql"+sql)
            conn.query(sql, function(data){
                var json1 = JSON.stringify({
                    responseCode: 200, 
                })
                console.log(json1);
                res.end(json1)
            })
       }
        
    } 
    else {
        // 没有指定的cookie
        var data = {errorCode:1,
        errorMassage:"没有指定的cookie"}
    }
}
//成绩查询
exports.course_grade_list = function(req,res,cookies){
    res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'})
    console.log("cookies"+cookies.id)
   if (cookies) {
        var sql = "SELECT cid,course.name,credit,teacher.`name` tname,grade from sc,course,teacher \
                    where cid in(select cid from sc where sid='"+cookies.id+"') and \
                    cid = course.id and course.tid=teacher.id and sid ='"+cookies.id+"';"
        console.log("sg_sql"+sql)
        conn.query(sql, function(data){
            rSet=[]
            for (x in data)
            {
                var tmp={
                    id : data[x].cid, 
                    name : data[x].name ,
                    credit : data[x].credit,
                    tname : data[x].tname,
                    grade : data[x].grade,
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
