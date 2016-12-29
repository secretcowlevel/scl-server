const User = require('../schemas/User.js');
const Email = require('../schemas/Email.js');

// @TODO - This is 100% inefficient. We should cache this data in redis and
// only do ONE lookup instead of email -> user....
exports.validateToken = (request, decodedToken, callback) => {
    Email.findOne({
        email: decodedToken.email
    })
    .exec((err, email) => {
        User.findOne({
            email: email._id // eslint-disable-line no-underscore-dangle
        })
        .populate('email')
        .then((user) => {
            if (err) {
                return callback(err, false, user);
            } else if (!email) {
                return callback(new Error('No User Found!'), false, user);
            }
            const returnUser = Object.assign({}, user.toObject(), {email: email.email});
            return callback(err, true, returnUser);
        });
    });
};
