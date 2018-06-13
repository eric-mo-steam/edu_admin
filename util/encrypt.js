var crypto = require('crypto');

const secret = 'abcdefg';   // 加密钥匙

exports.encrypt = function(str) {
    return crypto.createHmac('sha256', secret).update(str).digest('hex');
}
