const registration = require('./auth/registration.js');
const login = require('./auth/login.js');
const verify = require('./verify.js');
const pjson = require('../../package.json');

const resolve = (server) => {
    // registration
    registration(server);
    // login
    login(server);
    // verify
    verify(server);

    // index route
    server.route({
        method: 'GET',
        path: '/',
        handler: (req, res) => {
            res.view('index', {
                pjson: JSON.stringify(pjson.dependencies, null, 4)
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
    resolve
};
