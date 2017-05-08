/**
 * Created by Стас on 08.05.2017.
 */
const express = require('express');
const router = express.Router();
const jwt    = require('jsonwebtoken');
const User = require('../db/user');
const getUserByTocen = require('./getTocenHandler');

router.get('/', function (req, res, next) {
    getUserByTocen('/session', req, res, next);
});

router.post('/', function(req, res) {

    // find the user
    User.findOne({
        name: req.body.name
    }, function(err, user) {

        if (err) throw err;

        if (!user) {
            res.json({ success: false, message: 'Authentication failed. User not found.' });
        } else if (user) {

            // check if password matches
            if (user.password !== req.body.password) {
                res.json({ success: false, message: 'Authentication failed. Wrong password.' });
            } else {

                // if user is found and password is right
                // create a token
                var token = jwt.sign(user, 'lalala', {
                    expiresIn: 86400 // expires in 24 hours
                });

                res.json({
                    success: true,
                    message: 'Enjoy your token!',
                    token: token
                });
            }
        }
    });
});

module.exports = router;