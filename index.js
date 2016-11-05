
require('./lib/configHandler.js')();
// hapi server framework
const Hapi = require('hapi');
const dbUtils = require('./lib/helpers/dbUtils.js');
const mongoose = require('mongoose');
global.pjson = require('./package.json');
const authUtils = require('./lib/helpers/authUtils.js');
const routes = require('./lib/routes/');

const server = new Hapi.Server();
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
        validateFunc: authUtils.validateToken,
        verifyOptions: {
            algorithms: ['HS256']
        }
    });
})
.then(() => {
    // set up the routes
    routes.resolve(server);
})
.catch((err) => {
    console.log(`ERROR STARTING SERVER ${err}`); // eslint-disable-line
});


server.start((err) => {
    if (err) {
        throw err;
    }
    server.log(`Server running: ${server.info.uri}`);
});
