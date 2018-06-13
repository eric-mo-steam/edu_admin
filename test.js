var conn = require('./db/connector')

var sql = 'select * from user'
conn.query(sql, function(data){
    console.log(data)
})

