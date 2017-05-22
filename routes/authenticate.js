/**
 * Created by Стас on 08.05.2017.
 */
const express = require('express');
const router = express.Router();
const jwt    = require('jsonwebtoken');
const User = require('E:\\internChi\\restApi\\db\\user.js');
const passport = require('passport');

router.get('/', function (req, res, next) {
    /*getUserByTocen('/session', req, res, next);*/ res.json(req.user);
});

router.get('/logout', function(req, res){
    req.session.destroy(function (err) {
        res.redirect('/'); //Inside a callback… bulletproof!
    });
});

router.get('/facebook', (req, res, next) => {checkSession (req, res, next)}, passport.authenticate('facebook'));

router.get('/facebook/callback',
    passport.authenticate('facebook', { successRedirect: '/',
        failureRedirect: '/login' }));

router.get('/google', (req, res, next) => {checkSession (req, res, next)},
    passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
        res.redirect('/');
    });

router.post('/', function(req, res) {
    if(!req.body.name || !req.body.password) res.status(401).json({ success: false, message: 'invalid data pasted' });
    else {
        // find the user
        User.findOne({
            name: req.body.name
        }, function(err, user) {

            if (err) throw err;

            if (!user) {
                res.status(401).json({ success: false, message: 'Authentication failed. User not found.' });
            } else if (user) {

                // check if password matches
                if (user.password !== req.body.password) {
                    res.status(401).json({ success: false, message: 'Authentication failed. Wrong password.' });
                } else {

                    // if user is found and password is right
                    // create a token
                    let token = jwt.sign(user, 'lalala', {
                        expiresIn: 86400 // expires in 24 hours
                    });
                    req.token = token;
                    res.json({
                        success: true,
                        message: 'Enjoy your token!',
                        token: token
                    });
                }
            }
        });
    }
});

function checkSession (req, res, next) {
    if (req.isAuthenticated()) res.redirect('/');
    else next();
}

module.exports = router;