'use strict';

let resolve = (server) => {
    server.route({
        method: 'GET',
        path: '/',
        handler: (req, res) => {
            res.view('index', {title: global.Config.name + ' ' + global.Config.version});
        }
    });
}

module.exports = {
    resolve: resolve
};
