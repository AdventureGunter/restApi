/**
 * Created by Стас on 08.05.2017.
 */
const express = require('express');
const router = express.Router();
const passport = require('passport');

//const User = require('../db/user.js');
const autController = require('../controllers/authenticateController.js');


router.get('/', autController.checkSessionForGet, function (req, res, next) {
    res.json(req.user);
});

// LOCAL STRATEGY

router.post('/local-signup',
    passport.authenticate('local-signup', { successRedirect: '/session',
        failureRedirect: '/'})
);

router.post('/local-login',
    passport.authenticate('local-login', { successRedirect: '/session',
        failureRedirect: '/'})
);

//  FACEBOOK ROUTES

router.get('/facebook',autController.checkSessionForAut,
    passport.authenticate('facebook'/*, { scope: ['profile', 'email'] }*/));

router.get('/facebook/callback',
    passport.authenticate('facebook', { successRedirect: '/session',
        failureRedirect: '/' }));


// GOOGLE ROUTES

router.get('/google', autController.checkSessionForAut,
    passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
    passport.authenticate('google', { successRedirect: '/session',
    failureRedirect: '/' }));

// LOGOUT

router.get('/logout', function(req, res, next){
    req.session.destroy(function (err) {
        if (err) next(err);
        else res.redirect('/'); //Inside a callback… bulletproof!
    });
});

module.exports = router;



/*router.post('/', function(req, res) {
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
 });*/
