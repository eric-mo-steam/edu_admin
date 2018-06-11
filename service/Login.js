// 数据库mysql连接器
var conn = require('../database/connector')
//登陆操作
//测试网址：http://127.0.0.1:8000/Login/login.js?name=S101&pass=333333&ty=1
//输入数据为name(用户名),pass(密码),ty(用户类型)
//返回数据为stata(状态)，值为200时，表示用户和密码均正确，登陆成功
//                      值为100时，表示用户不存在，或者其他原因导致查询为空，登陆失败
//                      值为300时，表示密码错误，登陆失败
exports.Login = function(req,res){
    res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'})
    var pass = null
    var username= req.query.name
    console.log('username')
    console.log(username)
    var password= req.query.pass
    console.log('pass')
    console.log(password)
    var type = req.query.ty
    if(type==1){//学生
        var sql = "select distinct pass from user,student \
                   where student.uid=user.uid and student.id='"+username+"';"
    }
    else if(type==2){//老师
        var sql = "select distinct pass from user,teacher \
        where teacher.uid=user.uid and teacher.id='"+username+"';"
    }
    else{//管理员
        console.log('admin')
        console.log(username)
        if(username=='admin'){//默认管理员账号admin
            var sql = 'select distinct pass from user  where uid =1;'
            console.log('admin_sql')
            console.log(sql)
        }
    }
    console.log('sql')
    console.log(sql)
    conn.query(sql, function(data){
        console.log("data") 
        console.log(data)
        //默认返回100
        var stata={"stata":100}
        if(data[0]==null){//返回状态为100，表示查询结果为空
            res.end(JSON.stringify(stata))
        }
        //返回状态200，表示密码正确
        else if(data[0].pass==password){
            stata.stata=200
            res.end(JSON.stringify(stata))
        }
        //返回状态300，表示密码错误
        else{
            stata.stata=300
            res.end(JSON.stringify(stata))
        }
    })
}