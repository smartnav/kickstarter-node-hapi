var Users = require('./../services/users');
var Boom = require('boom');
var Common = require('./../config/common');
var Emails = require('./../config/emails');
var Jwt = require('jsonwebtoken');
var privateKey = process.env.PWD_KEY;
exports.findAll =  function(request, reply) {
    reply('yes');
}
/****************************************************/
// Filename: user.js
// Created: Navish Kumar
// Change history:
// 23.02.2018 / Navish
/****************************************************/

/* registration of end user 23.02.2018 By Navish */
exports.createUser = function(request, reply) {
  request.payload.password = Common.encrypt(request.payload.password);
  var users = request.payload;
    Users.createuser(users, function(err, userObj) {
      if (!err) {
          var tokenData = {
              name: userObj.name,
              id: userObj._id
          };

          userObj.token = Common.getToken(tokenData)
          Emails('RegisterLink', userObj.email, userObj, function(err, response) {
              if(!err){
                reply(Common.successResponse('Please confirm your email id by clicking on link in email', userObj));
              }
          });
      } else {
          if (11000 === err.code || 11001 === err.code) {
              reply(Boom.forbidden("please provide another user email"));
          } else reply(Boom.forbidden(err)); // HTTP 403
      }
    })
}

/****************************************************/
// Filename: user.js
// Created: Navish Kumar
// Change history:
// 23.02.2018 / Navish
/****************************************************/

/* login of end user 23.02.2018 By Navish */
exports.loginUser = function (request, reply) {
    Users.findusers(1, {'email': request.payload.email},function(err, userObj) {
        if (!err) {
            if (userObj === null) return reply(Boom.forbidden("invalid username or password"));
            if (request.payload.password === Common.decrypt(userObj.password)) {
                if(!userObj.isVerified) return reply(Boom.forbidden("Your email address is not verified. please verify your email address to proceed", userObj));

                var tokenData = {
                    name: userObj.name,
                    id: userObj._id
                };
                userObj.token = Common.getToken(tokenData)
                reply(Common.successResponse('Successfully authenticated!', userObj));
            } else reply(Boom.forbidden("invalid username or password"));
        } else {
            if (11000 === err.code || 11001 === err.code) {
                reply(Boom.forbidden("please provide another user email"));
            } else {
                console.error(err);
                return reply(Boom.badImplementation(err));
            }
        }
    });
}

/****************************************************/
// Filename: user.js
// Created: Navish Kumar
// Change history:
// 23.02.2018 / Navish
/****************************************************/

/* detail of user of end user 23.02.2018 By Navish */
exports.userDetails = function(request, reply) {
  var userId = Common.getUserId(request.headers.authorization);
  var query = {_id : userId};
  Users.findusers(1, query, function(err, userObj){
    console.log('userObj', userObj);
    if(err){
      return reply(Boom.badImplementation(err));
    } else if(!userObj){

      return reply(Boom.notFound('User not found'));
    } else {
      var userObj = userObj.toObject();
      reply(Common.successResponse('Successfully fetched!', userObj));
    }
  });
}
/****************************************************/
// Filename: user.js
// Created: Navish Kumar
// Change history:
// 23.02.2018 / Navish
/****************************************************/

/* forgot password for end user 23.02.2018 By Navish */
exports.forgotPassword = function(request, reply) {
  Users.findusers(1, {'email': request.payload.email},function(err, userObj) {
      if (!err) {
          if (userObj === null) return reply(Boom.forbidden("invalid email"));

          userObj.password = Common.decrypt(userObj.password);
          Emails('ForgotPassword', userObj.email, userObj, function(err, response) {
              if(!err){
                reply(Common.successResponse('Password is send to registered email id!', userObj));
              }
          });

      } else {
          console.error(err);
          return reply(Boom.badImplementation(err));
      }
  });
}
/****************************************************/
// Filename: user.js
// Created: Navish Kumar
// Change history:
// 23.02.2018 / Navish
/****************************************************/

/* email verificatiaon of end user 23.02.2018 By Navish */
exports.verifyEmail = function(request, reply) {
  var userId = Common.getUserId(request.headers.authorization);
      var query = {
        _id : userId
      }
      Users.findusers(1, query, function(err, user){
          if (err) {
              console.error(err);
              return reply(Boom.badImplementation(err));
          }
          if (user === null) return reply(Boom.forbidden("invalid verification link"));
          if (user.isVerified === true) return reply(Boom.forbidden("account is already verified"));
          user.isVerified = true;
          console.log(query, user)
          Users.updateUser(query, user, {}, function(err, user){

              if (err) {
                  console.error(err);
                  return reply(Boom.badImplementation(err));
              }
              reply(Common.successResponse('Account sucessfully verified!', user));
          })
      })
}
