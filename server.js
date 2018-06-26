'use strict';
require('dotenv').config();
var Hapi = require('hapi');
var Good = require('good');
var Path = require('path');
var Bell = require('bell');
var Mongoose = require('mongoose');
var AuthCookie = require('hapi-auth-cookie');
var Vision = require('vision');
var Inert = require('inert');
var db = require('./config/database').db;
//var authCredentials = require('./authCredentials');
/**Server configuration*/


var server = new Hapi.Server({
  connections: {
    routes:{
      files: {
        relativeTo: Path.join(__dirname, 'public')
      },
      cors: {
        origin: ['*'],
        headers : ['X-Requested-With', 'Content-Type']
      },
      payload: {
        maxBytes: 20 * 1024 * 1024 //20MB
      }
    }
  }
});
server.connection({port : process.env.PORT || 4000, routes: { log: true }});
/**End of server connection**/

//*register plugins **//
server.register([
  Inert,
  Vision,
  {
    register: require('hapi-swagger'),
    options : {
      //apiVersion : pkg.version,
      pathPrefixSize: 3
    }
  },
  {register: Bell},
  {register: require('./plugin/auth')},
  {register: Good,
    options: {
      reporters: [{
        reporter: require('good-console'),
        args:[{ log: '*', response: '*' }]
      }]
    }
  }
], function(err) {
    if(err){
      throw err;
    }
    //Setup the session strategy
    // server.auth.strategy('session', 'cookie', {
    //   password: 'secret_cookie_encryption_password', //Use something more secure in production
    //   redirectTo: '/', //If there is no session, redirect here
    //   isSecure: false //Should be set to true (which is the default) in production
    // });
    //server.auth.default('jwt');

    // server.auth.strategy('google', 'bell', {
    //     provider: 'google',
    //     password: 'cookie_encryption_password_secure',
    //     isSecure: false,
    //     clientId: '698814808982-rfghhk9uk8ce8ij5i646ge5p86mg2ivu.apps.googleusercontent.com',
    //     clientSecret: 'Dm7LNqWl0vlKqRZ2KRY2ZJY-',
    //     location: "http://localhost:4000"
    //   });
      // server.auth.strategy('twitter', 'bell', {
      //   provider: 'twitter',
      //   password: 'cookie_encryption_password_secure',
      //   isSecure: false,
      //   clientId: '189629964967442',
      //   clientSecret: 'a4d90dc3685115a909bf42f18a8338bd',
      //   location: "http://localhost:4000"
      // });
    /**
     * Start Server
     **/
    server.start(function () {
      process.env.URL = server.info.uri;
      server.log('info', 'Server running at: ' + process.env.URL);
    });

    /**
     * Views
     **/

    server.views({
      engines: {
          html: require('handlebars')
      },
      isCached : false,
      path: Path.join(__dirname, '/public/templates')
    });

    /**
     * Routes
     **/

    // Authentication Routes
    //server.route(require('./routes/auth'));
    // API Routes
    server.route(require('./routes/api'));

    //server.route(require('./routes/localauth'));
    // Serve Static Directory
    server.route({
      method: 'GET',
      path: '/{param*}',
      handler: {
        directory: {
          path: Path.join(__dirname, 'public'),
          listing: true
        }
      }
    });

});
