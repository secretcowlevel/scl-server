'use strict';

let resolve = (server) => {
    server.route({
        method: 'GET',
        path: '/',
        handler: (req, res) => {
            res.view('index', {title: 'SCL API Template v0.1'});
        }
    });
}

module.exports = {
    resolve: resolve
};
