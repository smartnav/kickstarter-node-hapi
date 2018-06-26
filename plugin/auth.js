var Users = require('./../services/users');
// bring your own validation function
async function validate (decoded, request, callback) {
  console.log(decoded);
    Users.findusers(1, {'_id': decoded.id},function(err, userObj) {
      if(err){
        return callback(null, false);
      }else {
        if(userObj){
          return callback(null, true);
        }else {
          return callback(null, false);
        }
      }
    });
};
exports.register = function(server, options, next) {
  //-- server.register has a callback, which might better to put server.auth.strategy on it
  server.register(require('hapi-auth-jwt2'), (err) => {
    if (err) { console.log('(X) hapi-auth-jwt-2 registration failed!'); }
    server.auth.strategy('jwt', 'jwt',
    { key: process.env.JWT || 'jwtkey',          // Never Share your secret key
      validateFunc: validate,            // validate function defined above
      verifyOptions: { algorithms: [ 'HS256' ] } // pick a strong algorithm
    });
    //server.auth.default('jwt');
    next();
  });
}

exports.register.attributes = {
  name: 'auth',
  version: '1.0.0',
  once: true
}
