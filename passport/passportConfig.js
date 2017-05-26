/**
 * Created by Стас on 22.05.2017.
 */

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const LocalStrategy = require('passport-local').Strategy;

const User = require('../db/user.js');
const dbController = require('../controllers/dbController.js');

const config = require('config');

const google = {
    clientID : config.get('config.Passport.google.id'),
    clientSecret : config.get('config.Passport.google.secret')
};

const facebook = {
    clientID : config.get('config.Passport.facebook.id'),
    clientSecret : config.get('config.Passport.facebook.secret')
};

module.exports = function(passport) {
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id)
            .then(user => done(null, user))
            .catch(err => done(err))
        });

    passport.use(new GoogleStrategy({
            clientID: google.clientID,
            clientSecret: google.clientSecret,
            callbackURL: '/session/google/callback'
        },
        function(accessToken, refreshToken, profile, done) {
            /*User.findOne({
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
            });*/
            //console.log(profile);
            dbController.findOrCreateProviderUser(profile, done);
        }
    ));

    passport.use(new FacebookStrategy({
            clientID: facebook.clientID,
            clientSecret: facebook.clientSecret,
            callbackURL: "/session/facebook/callback"
        },
        function(accessToken, refreshToken, profile, done) {
            console.log(profile);
            dbController.findOrCreateProviderUser(profile, done);
        }
    ));
    passport.use('local-login', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
        //passReqToCallback: true
    },
        function(username, password, done) {
            User.findOne({ username: username })
                .then(user => {
                    if (!user) {
                        return done(null, false, { message: 'Incorrect username.' });
                    }
                    if (!user.password) {
                        return done(null, false, { message: 'Incorrect password.' });
                    }
                    return done(null, user);
                }).catch(err => done(err));
        }
    ));

    passport.use('local-signup', new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true
        },
        function(req, username, password, done) {
            User.findOne({ username: username })
                .then(user => {
                    if (user) {
                        return done(null, false, { message: 'User already registered' });
                    }
                    User.create({
                        username: username,
                        password: password
                    }).then(user => done(null, user)).catch(err => done(err));
                }).catch(err => {
                    console.log(err);
                    done(err)
            });
        }
    ));
};