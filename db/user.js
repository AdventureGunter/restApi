/**
 * Created by Стас on 08.05.2017.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// set up a mongoose model
const userSchema = new Schema({
    username: String,
    password: String,

    fullName: String,

    provider: String,
    email: String,

    //profile: JSON,

    providerUserId:  String,
    //accessToken: String,

    dateAdded: {type: Date, default: Date.now}
});




let User = mongoose.model('User', userSchema);
module.exports = User;