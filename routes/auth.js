'use-strict';

var authRoutes = [
    {
      method : 'GET',
      path : '/',
      config: {
        // auth: {
        //   strategy: 'session',
        //   mode: 'try'
        // },
        // plugins: {
        //   'hapi-auth-cookie': { redirectTo: false }
        // },
        handler: function(request, reply) {
          return reply.file('index.html');
        }
      }
    }
]

module.exports = authRoutes;
