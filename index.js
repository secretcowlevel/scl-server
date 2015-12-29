'use strict';

// hapi server framework
const Hapi = require('hapi');
const server = new Hapi.Server();

require('./lib/configHandler.js')();

// set up the server
server.connection({
    host: 'localhost',
    port: '1337'
});

require('./lib/plugins')(server).then(() => {
    // set up the routes
    let routes = require('./lib/routes/');
    routes.resolve(server);
});


server.start((err) => {
    if (err) {
        throw err
    }
    server.log('Server running: ' + server.info.uri);
});
