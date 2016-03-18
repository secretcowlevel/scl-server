const User = require('../schemas/User.js');

exports.validateToken = (request, decodedToken, callback) => {
    User.findOne({
        email: decodedToken.email
    }).exec((err, user) => {
        if (err) {
            return callback(err, false, user);
        } else if (!user) {
            return callback(new Error('No User Found!'), false, user);
        }
        return callback(err, true, user);
    });
};
