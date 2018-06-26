var nodemailer = require("nodemailer"),
    crypto = require('crypto'),
    jwt = require('jsonwebtoken'),
    algorithm = 'aes-256-ctr';

var privateKey = process.env.PWD_KEY;



exports.decrypt = function(password) {
    return decrypt(password);
};

exports.encrypt = function(password) {
    return encrypt(password);
};

// exports.sentMailVerificationLink = function(user,token) {
//     var from = Config.email.accountName+" Team<" + Config.email.username + ">";
//     var mailbody = "<p>Thanks for Registering on "+Config.email.accountName+" </p><p>Please verify your email by clicking on the verification link below.<br/><a href='http://"+Config.server.host+":"+ Config.server.port+"/"+Config.email.verifyEmailUrl+"/"+token+"'>Verification Link</a></p>"
//     mail(from, user.userName , "Account Verification", mailbody);
// };
//
// exports.sentMailForgotPassword = function(user) {
//     var from = Config.email.accountName+" Team<" + Config.email.username + ">";
//     var mailbody = "<p>Your "+Config.email.accountName+"  Account Credential</p><p>username : "+user.userName+" , password : "+decrypt(user.password)+"</p>"
//     mail(from, user.userName , "Account password", mailbody);
// };


// method to decrypt data(password)
function decrypt(password) {
    var decipher = crypto.createDecipher(algorithm, privateKey);
    var dec = decipher.update(password, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
}

// method to encrypt data(password)
function encrypt(password) {
    var cipher = crypto.createCipher(algorithm, privateKey);
    var crypted = cipher.update(password, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}

exports.getToken = function (tokenData) {
    let secretKey = process.env.JWT || 'jwtkey';
    return jwt.sign(tokenData, secretKey, {expiresIn: '18h'});
}
exports.getUserId = function (token) {
    let secretKey = process.env.JWT || 'jwtkey';
    var tokenDecode = jwt.verify(token, secretKey);
    return tokenDecode.id;
}

exports.successResponse = function (message, data) {
    return {
        "statusCode": 200,
        "data": data,
        "message": message
    }
}
