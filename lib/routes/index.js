'use strict';

let resolve = (server) => {
    server.route({
        method: 'GET',
        path: '/',
        handler: (req, res) => {
            res.view('index', {
                pjson: JSON.stringify(require('../../package.json').dependencies, null, 4)
            });
        }
    });

    server.route({
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: 'static'
            }
        }
    });
}

module.exports = {
    resolve: resolve
};
