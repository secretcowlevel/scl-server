const crypto = require('crypto');
const User = require('../../../schemas/User.js');
const Promise = require('bluebird');

const length = 128;
const iterations = 4096;

const computeHash = (password, salt) => {
    if (salt) {
        return new Promise((resolve, reject) => {
            crypto.pbkdf2(password, salt, iterations, length, (err, key) => {
                if (err) {
                    return reject(err);
                }
                return resolve({
                    salt: salt,
                    hash: key.toString('base64')
                });
            });
        });
    }
    const randomBytes = new Promise((resolve, reject) => {
        crypto.randomBytes(length, (err, cryptoSalt) => {
            if (err) {
                return reject(err);
            }
            return resolve(cryptoSalt.toString('base64'));
        });
    });
    return randomBytes.then((newSalt) => {
        return computeHash(password, newSalt);
    });
};

const ensureUser = (email, password, username, salt) => {
    return new Promise((resolve, reject) => {
        crypto.randomBytes(length, (err, token) => {
            if (err) {
                return reject(err);
            }
            const tokenHex = token.toString('hex');
            User.findOne({
                email: email
            }).exec((lookupErr, user) => {
                if (lookupErr) {
                    return reject(lookupErr);
                } else if (user) {
                    reject('user already exists!');
                } else {
                    new User({
                        email: email,
                        passwordHash: password,
                        passwordSalt: salt,
                        username: username,
                        verified: false,
                        verifyToken: tokenHex
                    }).save((mongoErr, newUser) => {
                        if (mongoErr) {
                            return reject(mongoErr);
                        }
                        return resolve({hex: tokenHex, uid: newUser._id});
                    });
                }
            });
        });
    });
};

module.exports = {
    computeHash: computeHash,
    ensureUser: ensureUser
};
