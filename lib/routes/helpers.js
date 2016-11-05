const Boom = require('boom');

exports.handleError = (err, reply) => {
    if (err && err.isJoi) {
        reply(Boom.badRequest(err.details[0].message));
    } else {
        reply(Boom.badRequest(err));
    }
};
