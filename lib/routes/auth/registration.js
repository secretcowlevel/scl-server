const Joi = require('joi');
const Promise = require('bluebird');
const Boom = require('boom');
const hash = require('./helpers/hash.js');

const joiCreateUserEventSchema = Joi.object().keys({
    email: Joi.string().email(),
    username: Joi.string().min(3).max(24),
    password: Joi.string().min(6),
    confirmation: Joi.string().min(6)
});

const joiCreateUserOptions = {
    abortEarly: false
};

const validateCreateUser = (event) => {
    return new Promise((resolve, reject) => {
        Joi.validate(event, joiCreateUserEventSchema, joiCreateUserOptions, (err) => {
            if (err) {
                return reject(err);
            }
            // make sure the password matches
            if (event.password === event.confirmation) {
                return resolve();
            }
            // reject(boomError('Invalid Password/Confirmation Combination', 400));
            return reject('Invalid User/Password combination');
        });
    });
};

module.exports = (server) => {
    server.route({
        method: 'POST',
        path: '/api/register',
        handler: (request, reply) => {
            const email = request.payload.email;
            const password = request.payload.password;
            const username = request.payload.username;

            return validateCreateUser(request.payload)
                .then((salt) => {
                    console.log('salting');
                    return hash.computeHash(password, salt);
                })
                .then((data) => {
                    console.log(`ensuring ${email} ${data.hash} ${username} ${data.salt}`);
                    return hash.ensureUser(email, data.hash, username, data.salt);
                })
                .then(() => {
                    console.log('returning..');
                    reply({
                        success: true
                    });
                })
                .catch((err) => {
                    // @TODO this needs to be cleaner, duh.
                    if (err && err.isJoi) {
                        reply(Boom.badRequest(err.details[0].message));
                    } else {
                        reply(Boom.badRequest(err));
                    }
                });
        }
    });
};
