// Configuration File
const pjson = require('./package.json');
// The Name of the Application
exports.name = 'SCL API Template';

// The Version number of the application
exports.version = pjson.version;

// JWT Secret
exports.JWT_SECRET = 'nottoosecrethuh';

// MongoDB Connection Information
exports.mongoDB = [{
    'server': '127.0.0.1',
    'port': '27017',
    'database': 'scl',
    'user': '',
    'password': ''
}];
