/**
 * Created by Стас on 22.05.2017.
 */
const User = require('E:\\internChi\\restApi\\db\\user.js');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

module.exports = function(passport) {
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use(new GoogleStrategy({
            clientID: '1049236447666-rr8cpitlpok8l07fu3q18cv4klosdkm3.apps.googleusercontent.com',
            clientSecret: 'oGJANWG55O0FWPUZOC6Q2wOC',
            callbackURL: '/session/google/callback'
        },
        function(accessToken, refreshToken, profile, done) {
            User.findOne({
                'provider': 'google',
                'providerUserId': profile.id
            }, function(err, user) {
                if (err) {
                    return done(err);
                }
                //No user was found... so create a new user with values from Facebook (all the profile. stuff)
                if (!user) {
                    user = new User({
                        providerUserId: profile.id,
                        name: profile.displayName,
                        email: profile.email,
                        provider: 'google',
                        profile: profile
                    });
                    user.save(function(err) {
                        if (err) console.log(err);
                        return done(err, user);
                    });
                } else {
                    //found user. Return
                    return done(err, user);
                }
            });
        }
    ));

    passport.use(new FacebookStrategy({
            clientID: '438019803232655',
            clientSecret: 'a2823a6d7c299160bdacbbb821e5c823',
            callbackURL: "/session/facebook/callback"
        },
        function(accessToken, refreshToken, profile, done) {
            User.findOne({
                'provider': 'facebook',
                'providerUserId': profile.id
            }, function(err, user) {
                if (err) {
                    return done(err);
                }
                //No user was found... so create a new user with values from Facebook (all the profile. stuff)
                if (!user) {
                    user = new User({
                        providerUserId: profile.id,
                        name: profile.displayName,
                        email: profile.email,
                        provider: 'google',
                        profile: profile
                    });
                    user.save(function(err) {
                        if (err) console.log(err);
                        return done(err, user);
                    });
                } else {
                    //found user. Return
                    return done(err, user);
                }
            });
        }
    ));
};