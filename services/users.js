var users = require('./../models').users;

/*insert query*/
exports.createuser = function(objectToSave, callback) {
    users.create(objectToSave, callback);
}
exports.findusers = function(type, findObj, callback){
    if(type === 1){
      users.findOne(findObj, callback);
    }else {
      users.find(findObj, callback)
    }
}
exports.updateUser = function(matchObj, updateObj, options, callback) {
    users.update(matchObj, { $set: updateObj }, options, callback);
}
