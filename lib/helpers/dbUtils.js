'use strict'
const _ = require('underscore');

exports.createMongoURI = (settings) => {
    console.log('SETTINGS: ' + JSON.stringify(settings,null,4));
    if (!(settings instanceof Array)) {
        settings = [settings];
    }
    var connectionString = '';
    _.each(settings, function (setting, index, collection) {
        if (index === 0) {
            if (setting.user && setting.password) {
                connectionString += setting.user + ':' + setting.password + '@';
            }
        }
        connectionString +=
            setting.server + ':' +
            setting.port;
        if (index === collection.length - 1) {
            connectionString += '/' + setting.database;
        } else if (index < collection.length - 1) {
            connectionString += ',';
        }
    });
    return connectionString;
}
