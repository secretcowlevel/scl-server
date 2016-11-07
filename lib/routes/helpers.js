const Boom = require('boom');
const Joi = require('joi');

exports.handleError = (err, reply) => {
    if (err && err.isJoi) {
        reply(Boom.badRequest(err.details[0].message));
    } else {
        reply(Boom.badRequest(err));
    }
};

exports.validateJoiSchema = (event, schema) => new Promise((resolve, reject) => {
    Joi.validate(event, schema, {abortEarly: false}, (err) => {
        if (err) {
            return reject(err);
        }
        return resolve();
    });
});
