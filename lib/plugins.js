'use strict';
// inert serves static files
const inert = require('inert');
// vision is the view template engine
const vision = require('vision');
// good is the logger!
const good = require('good');
const goodconsole = require('good-console');
const path = require('path');

let plugins = [
    {
        register: good,
        options: {
            reporters: [
                {
                    reporter: goodconsole,
                    events: {
                        response: '*',
                        log: '*'
                    }
                }
            ]
        }
    },
    {
        register: inert
    },
    {
        register: vision
    }
]

// this function is meant to return a Promise
module.exports = (server) => {
    return new Promise((resolve, reject) => {
        // register the plugins
        server.register(plugins, (err) => {
            if (err) {
                reject();
                throw err;
            }

            // setup the view handler
            server.views({
                engines: {
                    hbs: require('handlebars')
                },
                relativeTo: path.join(__dirname, '../'),
                path: 'views'
            });

            // resolve the promise
            resolve();
        });
    });

}
