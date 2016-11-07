const Email = require('../schemas/Email.js');

module.exports = (server) => {
    server.route({
        method: 'GET',
        path: '/verify',
        handler: (request, response) => {
            // Verify an email!
            if (request.query.email) {
                Email.findOne({
                    email: request.query.email
                })
                .then((email) => {
                    if (!email) {
                        response.redirect('/');
                    } else if (email.verifyToken === request.query.v) {
                        if (email.verified) {
                            response.redirect('/');
                        } else {
                            email.verified = true; // eslint-disable-line no-param-reassign
                            email.save().then(() => {
                                response('Your email has been verified!');
                            });
                        }
                    }
                })
                .catch(() => {
                    response('ERROR');
                });
            } else {
                response.redirect('/');
            }
        }
    });
};
