const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email: mongoose.Schema.Types.String,
    passwordHash: mongoose.Schema.Types.String,
    passwordSalt: mongoose.Schema.Types.String,
    verified: mongoose.Schema.Types.Boolean,
    verifyToken: mongoose.Schema.Types.String,
    username: mongoose.Schema.Types.String
});

module.exports = mongoose.model('User', userSchema);
