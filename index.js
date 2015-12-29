'use strict';

// hapi server framework
const Hapi = require('hapi');



const server = new Hapi.Server();

// set up the server
server.connection({
    host: 'localhost',
    port: '1337'
});

let pluginLoader = require('./lib/plugins')(server);

pluginLoader.then(() => {
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
