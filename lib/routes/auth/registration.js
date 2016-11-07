const Joi = require('joi');
const handleError = require('../helpers.js').handleError;
const hash = require('./helpers/hash.js');
const sendVerificationEmail = require('../../helpers/email.js').sendVerificationEmail;

const joiCreateUserEventSchema = Joi.object().keys({
    email: Joi.string().email().required(),
    username: Joi.string().min(3).max(24).required(),
    password: Joi.string().min(6).required()
});

const joiCreateUserOptions = {
    abortEarly: false
};

const validateCreateUser = event => new Promise((resolve, reject) => {
    Joi.validate(event, joiCreateUserEventSchema, joiCreateUserOptions, (err) => {
        if (err) {
            return reject(err);
        }
        // assume passphrase is valid
        return resolve();
    });
});

module.exports = (server) => {
    server.route({
        method: 'POST',
        path: '/api/register',
        handler: (request, reply) => {
            const inputEmail = request.payload.email;
            const password = request.payload.password;
            const username = request.payload.username;

            return validateCreateUser(request.payload)
                .then(salt => hash.computeHash(password, salt)) // @TODO - validate doesn't return anything!
                .then(data => hash.ensureUser(inputEmail, data.hash, username, data.salt))
                .then(({email, code}) => sendVerificationEmail(email, email, code))
                .then(() => reply({success: true}))
                .catch(err => handleError(err, reply));
        }
    });
};
