'use strict';
var Joi = require('joi');
var ctrl = require('./../controllers');


var apiRoutes = [
  {
      method: 'get',
      path: '/bell/door',
      config: {
          auth: 'jwt',
          handler: function (request, reply) {
              console.log('asdf');
              if (!request.auth.isAuthenticated) {
                  return reply('Authentication failed due to: ' + request.auth.error.message);
              }
              reply('<pre>' + JSON.stringify(request.auth.credentials, null, 4) + '</pre>');
          }
      }
},
    {
      method : 'POST',
      path : '/api/users/createuser',
      config : {
        handler : ctrl.users.createUser,
        description : 'create new user',
        tags : ['api'],
        validate: {
            payload:{
              name : Joi.string().trim().min(3).max(100).required(),
              email: Joi.string().email().trim().required(),
              password: Joi.string().min(3).max(100).required(),
              gender: Joi.string().valid('female', 'male'),
              type : Joi.string().valid('Seller', 'User'),
              phoneNumber : Joi.string().trim().min(1).max(10)
            }
          },
          plugins: {
            'hapi-swagger': {
              responseMessages: [
              { code: 201, message: 'Created' },
              { code: 400, message: 'Bad Request' },
              { code: 500, message: 'Internal Server Error'}
              ]
            }
          }
      }
    },
    {
      method : 'POST',
      path : '/api/users/login',
      config : {
        handler : ctrl.users.loginUser,
        description: 'Validate & Login',
        tags: ['api'],
        validate: {
          payload: {
            email: Joi.string().email().trim().required(),
            password: Joi.string().trim().min(3).max(20).required()
          }
        },
        plugins: {
          'hapi-swagger': {
            responseMessages: [
            { code: 201, message: 'Created' },
            { code: 400, message: 'Bad Request' },
            { code: 500, message: 'Internal Server Error'}
            ]
          }
        }
      }
    },
    {
      method : 'GET',
      path : '/api/users/userdetails',
      config : {
        auth: 'jwt',
        handler : ctrl.users.userDetails,
        description : 'To find detail of user',
        tags : ['api'],
        validate: {
           headers: Joi.object({
                 'authorization': Joi.string().required()
           }).unknown()
          },
          response: {
            options: {
              allowUnknown: true
            }
          },
          plugins: {
            'hapi-swagger': {
              responseMessages: [
              { code: 200, message: 'OK' },
              { code: 400, message: 'Bad Request' },
              { code: 404, message: 'Employee Not Found' },
              { code: 500, message: 'Internal Server Error'}
              ]
            }
          }
        }
    },
    { // forgotPassword functionality Employees
      method: 'POST',
      path: '/api/users/forgotPassword',
      config: {
        handler: ctrl.users.forgotPassword,
        description: 'forgotPassword request based on email',
        tags: ['api'],
        validate: {
          payload: {
            email: Joi.string().email().trim().required()
          }
        },
        plugins: {
          'hapi-swagger': {
            responseMessages: [
            { code: 201, message: 'Created' },
            { code: 400, message: 'Bad Request' },
            { code: 500, message: 'Internal Server Error'}
            ]
          }
        }
      }
    },
    { // verify user
      method: 'GET',
      path: '/api/users/verifyEmail',
      config: {
        auth: 'jwt',
        handler: ctrl.users.verifyEmail,
        description: 'verifyEmail before login to Account',
        tags: ['api'],
        validate:{
          headers: Joi.object({
                'authorization': Joi.string().required()
          }).unknown()
        },
        plugins: {
          'hapi-swagger': {
            responseMessages: [
            { code: 201, message: 'Created' },
            { code: 400, message: 'Bad Request' },
            { code: 500, message: 'Internal Server Error'}
            ]
          }
        }
      }
    }
];
module.exports = apiRoutes;
