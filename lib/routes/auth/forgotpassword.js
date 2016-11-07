const Joi = require('joi');
const crypto = require('crypto');
const validateJoiSchema = require('../helpers.js').validateJoiSchema;
const Email = require('../../schemas/Email.js');
const User = require('../../schemas/User.js');
const sendForgottenPasswordEmail = require('../../helpers/email.js').sendForgottenPasswordEmail;
const sendTempPasswordEmail = require('../../helpers/email.js').sendTempPasswordEmail;
const hashUtils = require('./helpers/hash.js');

const joiForgotPasswordPostSchema = Joi.object().keys({
    email: Joi.string().email().required()
});

module.exports = (server) => {
    server.route({
        method: 'GET',
        path: '/forgotpassword',
        handler: (request, response) => {
            if (request.query.email) {
                Email.findOne({
                    email: request.query.email
                })
                .then((email) => {
                    if (!email) {
                        response.redirect('/');
                    } else if (email.verifyToken === request.query.v) {
                        // they are resetting their password, so they clicked the email link..
                        // so we can verify their email while we're here.
                        email.verified = true; // eslint-disable-line no-param-reassign
                        email.save().then(() => {
                            User.findOne({
                                email: email._id
                            })
                            .then((user) => {
                                const newPass = String(Math.floor(Math.random() * 90000) + 10000);
                                hashUtils.computeHash(newPass)
                                .then(({salt, hash}) => {
                                    user.passwordHash = hash; // eslint-disable-line no-param-reassign
                                    user.passwordSalt = salt; // eslint-disable-line no-param-reassign
                                    user.save().then(() => {
                                        sendTempPasswordEmail(request.query.email, request.query.email, newPass);
                                        response('saved!');
                                    });
                                });
                            });
                        });
                    } else {
                        response('WRONG TOKEN');
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

    server.route({
        method: 'POST',
        path: '/api/forgotpassword',
        handler: (request, response) => {
            const email = request.payload.email;
            return validateJoiSchema(request.payload, joiForgotPasswordPostSchema)
            .then(() => {
                Email.findOne({
                    email
                })
                .then((dbEmail) => {
                    if (dbEmail) {
                        // @TODO - abstract to ONE crypto generator file
                        crypto.randomBytes(32, (err, buffer) => {
                            if (err) {
                                throw new Error('error in cryptography!');
                            }
                            dbEmail.verifyToken = buffer.toString('hex'); // eslint-disable-line no-param-reassign
                            dbEmail.save()
                            .then(newEmail => sendForgottenPasswordEmail(newEmail.email, newEmail.email, newEmail.verifyToken))
                            .then(() => {
                                response('reset your token');
                            });
                        });
                    } else {
                        response.redirect('/');
                    }
                });
            });
        }
    });
};
