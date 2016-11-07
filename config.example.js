// Configuration File
const pjson = require('./package.json');
// The Name of the Application
exports.name = 'SCL API Template';
// the Base URL to use
exports.url = 'http://localhost:1337';

// The Version number of the application
exports.version = pjson.version;

// JWT Secret
exports.JWT_SECRET = 'nottoosecrethuh';

// MongoDB Connection Information
exports.mongoDB = [{
    server: '127.0.0.1',
    port: '27017',
    database: 'scl',
    user: '',
    password: ''
}];

// Mandrill
exports.mandrill = {
    key: '',
    from: 'info@secretcowlevel.com'
};

// Twitter
exports.twitter = {
    consumer_key: '',
    consumer_secret: '',
    access_token: '',
    access_token_secret: '',
    timeout_ms: 60 * 1000
};
