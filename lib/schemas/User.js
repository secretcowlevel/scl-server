const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'email',
        required: true
    },
    passwordHash: mongoose.Schema.Types.String,
    passwordSalt: mongoose.Schema.Types.String,
    username: mongoose.Schema.Types.String
});

module.exports = mongoose.model('user', userSchema);
