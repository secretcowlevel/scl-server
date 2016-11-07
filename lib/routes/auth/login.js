
const Joi = require('joi');
const User = require('../../schemas/User.js');
const Email = require('../../schemas/Email.js');
const jwt = require('jsonwebtoken');
const uuid = require('node-uuid');
const hash = require('./helpers/hash.js');

const joiLoginEventSchema = Joi.object().keys({
    email: Joi.string().email(),
    password: Joi.string().min(5)
});

const joiLoginOptions = {
    abortEarly: false
};

const generateToken = email => new Promise((resolve) => {
    const application = global.pjson.name;
    const sessionID = uuid.v4();
    const token = jwt.sign({
        email,
        application,
        roles: null,
        sessionID
    }, global.Config.JWT_SECRET, {algorithm: 'HS256'});

    return resolve({
        sessionID,
        token
    });
});

const validateLogin = event => new Promise((resolve, reject) => {
    Joi.validate(event, joiLoginEventSchema, joiLoginOptions, (err) => {
        if (err) {
            return reject(err);
        }
        return resolve();
    });
});

const getUser = email => new Promise((resolve, reject) => {
    Email.findOne({
        email
    }).then((dbEmail) => {
        if (dbEmail) {
            User.findOne({
                email: dbEmail
            }).then((user) => {
                if (user) {
                    resolve({
                        salt: user.passwordSalt,
                        hash: user.passwordHash,
                        verified: user.verified,
                        uid: user._id,
                        username: user.username
                    });
                } else {
                    reject('ERROR');
                }
            });
        } else {
            // @TODO error handling should be better!
            reject('ERROR');
        }
    });
});

module.exports = (server) => {
    server.route({
        method: 'POST',
        path: '/api/login',
        handler: (request, reply) => {
            let username = null;
            const email = request.payload.email;
            const password = String(request.payload.password);
            return validateLogin(request.payload)
                .then(() => getUser(email))
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
                            username,
                            session: tokenData.sessionID,
                            token: tokenData.token
                        }
                    });
                })
                .catch((err) => {
                    // @TODO better error handling here
                    reply(err);
                });
        }
    });
};
