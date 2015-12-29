'use strict';
const fs = require('fs');
const path = require('path');

module.exports = () => {
    try {
    	require.resolve('../config.js');
    } catch (err) {
    	if (err.code !== 'MODULE_NOT_FOUND') throw err; // should never happen

    	// Copy it over synchronously from config-example.js since it's needed before we can start the server
    	fs.writeFileSync(path.resolve(__dirname, '../config.js'),
    		fs.readFileSync(path.resolve(__dirname, '../config.example.js')));
    } finally {
    	global.Config = require('../config.js');
    }
}
