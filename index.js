'use strict';

// hapi server framework
const Hapi = require('hapi');
const server = new Hapi.Server();
const dbUtils = require('./lib/helpers/dbUtils.js');
const mongoose = require('mongoose');
global.pjson = require('./package.json');
require('./lib/configHandler.js')();

// set up the server
server.connection({
    host: 'localhost',
    port: '1337'
});

mongoose.connect(dbUtils.createMongoURI(global.Config.mongoDB));

require('./lib/plugins')(server)
.then(() => {
    server.auth.strategy('token', 'jwt', {
        key: global.Config.JWT_SECRET,
        validateFunc: require('./lib/helpers/authUtils.js').validateToken,
        verifyOptions: {
            algorithms: ['HS256']
        }
    });
})
.then(() => {
    // set up the routes
    let routes = require('./lib/routes/');

    routes.resolve(server);
})
.catch((err) => {
    console.log(`ERROR STARTING SERVER ${err}`);
});


server.start((err) => {
    if (err) {
        throw err;
    }
    server.log(`Server running: ${server.info.uri}`);
});
