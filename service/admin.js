// 数据库mysql连接器
var conn = require('../database/connector')
var util = require('util')
//返回全部学生信息
exports.student_list = function(req,res,cookies){
    res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'})
    console.log("cookies"+cookies.id)
    console.log(req.body) 
    if (cookies) {
        var sql = "select student.id,student.name,sex,major from student"
        console.log("a_sql"+sql)
        conn.query(sql, function(data){
            rSet=[]
            for (x in data){   
                var sextmp
                if(data[x].sex==1){
                    sextmp='男'
                }
                else if(data[x].sex==-1){
                    sextmp='女'
                }
                else{
                    sex=null
                }
                var tmp={
                    rank : x+1,
                    id : data[x].id, 
                    name : data[x].name ,
                    sex : sextmp,
                    major : data[x].major,
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
//添加学生
exports.save_student = function(req,res,cookies){
    res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'})
    console.log("cookies"+cookies.id)
    console.log(req.body) 
   if (cookies) {
           var sextmp=0
           if(req.body.sex=='男'){
                sextmp = 1
           }
           else if(req.body.sex=='女'){
                sextmp = -1
           } 
            var sql = util.format("insert into user(pass,type) values('%s',1);",'333333')
            console.log("a_sql"+sql)
            conn.query(sql, function(data,err){
                console.log(data)
                var sql = "insert into student values('"+req.body.id+"','"+req.body.name+"',"+sextmp+",'"+req.body.major+"',"+data.insertId+");"
                console.log("c_sql"+sql)
                conn.query(sql, function(data,err){
                    var json1 = JSON.stringify({
                        responseCode: 200, 
                    })
                    console.log(json1);
                    res.end(json1)
                })
                
                
            })
    } 
    else {
        // 没有指定的cookie
        var data = {errorCode:1,
        errorMassage:"没有指定的cookie"}
    }
}
//删除学生信息
exports.delete_student = function(req,res,cookies){
    res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'})
    console.log("cookies"+cookies.id)
    console.log(req.body) 
   if (cookies) {
            var sql = util.format("select uid from student where id = '%s'",req.body.sid)
            console.log("a_sql"+sql)
            conn.query(sql, function(data,err){
                console.log(data)
                var sql = util.format("delete from student where id = '%s'",req.body.sid)     
                conn.query(sql, function(data,err){
                    console.log(data)
                  //  res.end(data)
                })
                var sql = util.format("delete from user where uid = %d",data[0].uid)
                console.log("a_sql"+sql)
                conn.query(sql, function(data,err){
                    var json1 = JSON.stringify({
                        responseCode: 200, 
                    })
                    console.log(json1);
                    res.end(json1)
                })
            })
    } 
    else {
        // 没有指定的cookie
        var data = {errorCode:1,
        errorMassage:"没有指定的cookie"}
    }
}
//返回全部老师信息
exports.teacher_list = function(req,res,cookies){
    res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'})
    console.log("cookies"+cookies.id)
    console.log(req.body) 
    if (cookies) {
        var sql = "select id,name,dept from teacher"
        console.log("a_sql"+sql)
        conn.query(sql, function(data){
            console.log(data.length)
            var rSet=[]
            for(x in data){
                var tmp={
                    rank : x+1,
                    id : data[x].id, 
                    name : data[x].name ,
                    dept : data[x].dept,
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
//返回全部课程信息
exports.course_list = function(req,res,cookies){
    res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'})
    console.log("cookies"+cookies.id)
    console.log(req.body) 
    if (cookies) {
        var sql = "select distinct course.id,course.name,credit,teacher.name tname from course,teacher where teacher.id=course.tid;"
        console.log("a_sql"+sql)
        conn.query(sql, function(data){
           var  rSet=[]
            for(x in data){
                var tmp={
                    rank : x+1,
                    id : data[x].id, 
                    name : data[x].name ,
                    credit : data[x].credit,
                    tname : data[x].tname,
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
//添加课程
exports.save_course = function(req,res,cookies){
    res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'})
    console.log("cookies"+cookies.id)
    console.log(req.body) 
   if (cookies) {
            var sql = util.format("insert into course(id,name,credit,tid) values('%s','%s',%d,'%s');",req.body.id,req.body.name,req.body.credit,req.body.tid)
            console.log("a_sql"+sql)
            conn.query(sql, function(data,err){          
                var json1 = JSON.stringify({
                    responseCode: 200, 
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
//删除学生信息
exports.delete_student = function(req,res,cookies){
    res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'})
    console.log("cookies"+cookies.id)
    console.log(req.body) 
   if (cookies) {
            var sql = util.format("select uid from student where id = '%s'",req.body.sid)
            console.log("a_sql"+sql)
            conn.query(sql, function(data,err){
                console.log(data)
                var sql = util.format("delete from student where id = '%s'",req.body.sid)     
                conn.query(sql, function(data,err){
                    console.log(data)
                  //  res.end(data)
                })
                var sql = util.format("delete from user where uid = %d",data[0].uid)
                console.log("a_sql"+sql)
                conn.query(sql, function(data,err){
                    var json1 = JSON.stringify({
                        responseCode: 200, 
                    })
                    console.log(json1);
                    res.end(json1)
                })
            })
    } 
    else {
        // 没有指定的cookie
        var data = {errorCode:1,
        errorMassage:"没有指定的cookie"}
    }
}