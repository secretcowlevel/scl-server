const mongoose = require('mongoose');

const emailSchema = mongoose.Schema({
    email: mongoose.Schema.Types.String,
    verified: {
        type: mongoose.Schema.Types.Boolean,
        default: false
    },
    verifyToken: mongoose.Schema.Types.String
});

module.exports = mongoose.model('Email', emailSchema);
