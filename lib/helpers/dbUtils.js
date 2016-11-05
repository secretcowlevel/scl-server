
const _ = require('underscore');

// @TODO - fix this for string concatenation!
/* eslint prefer-template: 0 */
exports.createMongoURI = (settings) => {
    let newSettings = settings;
    if (!(newSettings instanceof Array)) {
        newSettings = [settings];
    }
    let connectionString = '';
    _.each(newSettings, (setting, index, collection) => {
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
};
