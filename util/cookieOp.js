// 加密模块encrypt
var encrypt = require('./encrypt')

function CookieOp() { 
    var cookies
    var request
    var response
    var maxAge

    this.set = function(req, res) { 
        this.request = req
        this.response = res
        this.cookies = req.signedCookies
        this.maxAge = 10000
    };

    this.get = function(key) { 
        return eval('cookies.' + key)
    };

    this.remove = function(key) {
        this.response.clearCookie(key);
    };

    this.append = function(key, value) {
        // 增加新的cookie
        this.response.cookie(key, value, {maxAge: this.maxAge, httpOnly: true, signed: true})

        this.cookies[key] = value
        // 深拷贝，不影响原有cookie
        var json = JSON.parse(JSON.stringify(this.cookies))
        // 删除原有的哈希值
        delete json.hash
        // 哈希值做数据校验，判断数据是否被篡改
        const hash = encrypt.encrypt(JSON.stringify(json));
        this.response.cookie('hash', hash, { maxAge: this.maxAge, httpOnly: true, signed: true});
    };

    this.empty = function() {
        var json = JSON.parse(JSON.stringify(this.cookies))
        for(var key in json) {
            this.remove(key)
        }
    };

    this.getCookies = function() {
        return this.cookies
    };

    this.validCookies = function() {
        // 深拷贝
        var json = JSON.parse(JSON.stringify(this.cookies))
        if (json.hasOwnProperty('hash')) {
            var hash = json.hash
            delete json.hash
            // 其余部分计算的哈希值与hash相等，则验证通过
            if (hash === encrypt.encrypt(JSON.stringify(json))) {
                return true
            }
        }
        return false
    };
}; 
module.exports = CookieOp;