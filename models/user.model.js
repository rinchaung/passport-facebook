const mongoose = require('mongoose');

const mongooseSchema = new mongoose.Schema({
    facebookId: { type: 'String' },
    name: {
        type: 'String',
        required: true
    },
    email: {
        type: 'String',
        required: true
    },
    image: {
        type: 'String',
        required: true
    }
});

module.exports = mongoose.model('users', mongooseSchema);