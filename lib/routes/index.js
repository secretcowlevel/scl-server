'use strict';

const resolve = (server) => {
    // registration
    require('./auth/registration.js')(server);
    // login
    require('./auth/login.js')(server);

    // index route
    server.route({
        method: 'GET',
        path: '/',
        handler: (req, res) => {
            res.view('index', {
                pjson: JSON.stringify(require('../../package.json').dependencies, null, 4)
            });
        }
    });

    // test JWT
    server.route({
        method: 'GET',
        path: '/secret',
        config: {
            auth: 'token',
            handler: (request, reply) => {
                reply(request.auth.credentials);
            }
        }
    });

    // static files
    server.route({
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: 'static'
            }
        }
    });
};

module.exports = {
    resolve: resolve
};
