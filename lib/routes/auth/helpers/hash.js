const crypto = require('crypto');
const User = require('../../../schemas/User.js');
const Email = require('../../../schemas/Email.js');

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
                    salt,
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
    return randomBytes.then(newSalt => computeHash(password, newSalt));
};

const ensureUser = (email, password, username, salt) => new Promise((resolve, reject) => {
    crypto.randomBytes(length, (err, token) => {
        if (err) {
            reject(err);
        }
        const tokenHex = token.toString('hex');
        Email.findOne({
            email
        }).exec((lookupErr, user) => {
            if (lookupErr) {
                reject(lookupErr);
            } else if (user) {
                reject('user already exists!');
            } else {
                new Email({
                    email,
                    verifyToken: tokenHex
                })
                .save()
                .then((newEmail) => {
                    new User({
                        email: newEmail._id,
                        passwordHash: password,
                        passwordSalt: salt,
                        username
                    }).save((mongoErr/* , newUser */) => {
                        if (mongoErr) {
                            return reject(mongoErr);
                        }
                        return resolve({code: tokenHex, email: newEmail.email});
                    });
                });
            }
        });
    });
});

module.exports = {
    computeHash,
    ensureUser
};
