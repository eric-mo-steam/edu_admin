var mysql = require('mysql')
var conn = mysql.createConnection({
    host    : 'localhost',
    user    : 'root',
    password: 'steam',
    database: 'edu_admin'
})

conn.connect()

exports.query = function(sql, handler){
    conn.query(sql, function(err, result){
        if(err) {
            throw err
        }
        handler(result)
    })
}

exports.disconnect = function(){
    conn.end();
}