/**
 * Created by Стас on 08.05.2017.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// set up a mongoose model
const User = new Schema({
    name: String,
    password: String,
    username: String,
    provider: String,
    email: String,
    profile: JSON,
    providerUserId:  String,
    accessToken: String,
    dateAdded: {type: Date, default: Date.now}
});

module.exports = mongoose.model('User', User);