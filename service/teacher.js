// 数据库mysql连接器
var conn = require('../database/connector')
//返回学生名单-待完善
exports.course_grade_list = function(req,res,cookies){
    res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'})
    console.log("cookies"+cookies.id)
   if (cookies) {
            var sql = "select student.id,student.name,sex,major,grade,sc.cid from student,sc where student.id=sc.sid and cid in (select id from course where tid='"+cookies.id+"');"
                console.log("t_sql"+sql)
                conn.query(sql, function(data){
                    rSet=[]
                    for (x in data)
                    {   
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
                            grade : data[x].grade,
                            cid : data[x].cid
                        }
                        rSet.push(tmp)
                    }
                    var json1 = JSON.stringify(rSet)
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
//返回所教授的的课程
exports.course_teach_list = function(req,res,cookies){
    res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'})
    console.log("cookies"+cookies.id)
   if (cookies) {
        var sql = "select id,name,credit from course where tid ='"+cookies.id+"';"
        console.log("c_sql"+sql)
        conn.query(sql, function(data){
            rSet=[]
            for (x in data)
            {
                var tmp={
                    id : data[x].id, 
                    name : data[x].name ,
                    credit : data[x].credit,
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
//老师信息
exports.personal_info = function(req,res,cookies){
    res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'})
    console.log("cookies"+cookies.id)
   if (cookies) {
        var sql = "select distinct id,name from teacher where id ='"+cookies.id+"';"
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
//修改成绩
exports.update_grade = function(req,res,cookies){
    res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'})
    console.log("cookies"+cookies.id)
    console.log(req.body) 
   if (cookies) {
       for(i in req.body){
            var sql = "update sc set grade='"+req.body[i].grade+"' where sid= '"+req.body[i].id+"' and cid ='"+req.body[i].cid+"';"
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