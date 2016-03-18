'use strict';
const Joi = require('joi');
const User = require('../../schemas/User.js');
const jwt = require('jsonwebtoken');
const uuid = require('node-uuid');
const hash = require('./helpers/hash.js');
const Promise = require('bluebird');

const joiLoginEventSchema = Joi.object().keys({
    email: Joi.string().email(),
    password: Joi.string().min(6)
});

const joiLoginOptions = {
    abortEarly: false
};

const generateToken = (email) => {
    return new Promise((resolve) => {
        const application = global.pjson.name;
        const sessionID = uuid.v4();
        const token = jwt.sign({
            email: email,
            application: application,
            roles: null,
            sessionID: sessionID
        }, global.Config.JWT_SECRET, {algorithm: 'HS256'});

        return resolve({
            sessionID: sessionID,
            token: token
        });
    });
};

const validateLogin = (event) => {
    return new Promise((resolve, reject) => {
        Joi.validate(event, joiLoginEventSchema, joiLoginOptions, (err) => {
            if (err) {
                return reject(err);
            }
            return resolve();
        });
    });
};

const getUser = (email) => {
    return new Promise((resolve, reject) => {
        User.findOne({
            email: email
        }).exec((err, user) => {
            if (err) {
                // @TODO error handling should be better!
                return reject(err);
            } else if (user) {
                return resolve({
                    salt: user.passwordSalt,
                    hash: user.passwordHash,
                    verified: user.verified,
                    uid: user._id,
                    username: user.username
                });
            }
            // @TODO error handling should be better!
            return reject('ERROR');
        });
    });
};

module.exports = (server) => {
    server.route({
        method: 'POST',
        path: '/api/login',
        handler: (request, reply) => {
            let username = null;
            const email = request.payload.email;
            const password = request.payload.password;
            return validateLogin(request.payload)
                .then(() => {
                    return getUser(email);
                })
                .then((data) => {
                    username = data.username;
                    const userHash = data.hash;
                    return hash.computeHash(password, data.salt)
                        .then((hashData) => {
                            if (userHash !== hashData.hash) {
                                return Promise.reject({success: false, message: 'Invalid Password!'});
                            }
                            return generateToken(email);
                        });
                })
                .then((tokenData) => {
                    reply({
                        success: true,
                        data: {
                            username: username,
                            session: tokenData.sessionID,
                            token: tokenData.token
                        }
                    });
                })
                .catch((err) => {
                    // @TODO better error handling here
                    console.log('ERR');
                    reply(err);
                });
        }
    });
};
