/**
 * Created by User on 24.05.2017.
 */
const User = require('../db/user.js');

module.exports.findOrCreateProviderUser = function (profile, done)  {

    User.findOne({
        'provider': profile.provider,
        'providerUserId': profile.id
    }).then(user => {
        console.log(profile);
        //No user was found... so create a new user with values from Facebook (all the profile. stuff)
        if (!user) {
            User.create({
                username: '',
                password: '',
                fullName: profile.displayName,
                provider: profile.provider,
                //email: profile.emails[0].value || '',
                providerUserId:  profile.id
            }).then(user => {
                done(null, user)
            }).catch(err => done(err))
        } else {
            //found user. Return
            return done(null, user);
        }
    }).catch(err => done(err));
};