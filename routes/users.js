const express = require('express');
const router = express.Router();
const User = require('../db/user');
const getUserByTocen = require('./getTocenHandler');


/*router.use(function(req, res, next) {
    getUserByTocen('/users', req, res, next);
});*/

/* GET users listing. */
router.get('/', function(req, res, next) {
    User.find({}, function (err, data) {
        if (err) res.json(err);
        else res.json(data);
    });
});

router.get('/*', function(req, res, next) {
    User.findById(req.url.substr(1), function (err, data) {
        if (err) res.json(err);
        else res.json(data);
    });
});

router.use(function(req, res, next) {
    if (req.isAuthenticated()) next();
    else (res.redirect('/'));
});

router.post('/', function(req, res, next) {
    let name = req.body.name;
    let password = req.body.password;

    if(!name || !password) res.status(400).json({ErrorCode : "invalid_request", Error :"Required param : username/password"});

    else {
        User.findOne({name: req.body.name}, function (err, data) {
            if (err) res.json(err);
            if (data) res.status(403).json({error: 'user already exist'});
            else {
                let newUser = new User ({
                    name: req.body.name,
                    password: req.body.password
                });

                newUser.save(function (err, data) {
                    if (err) res.json(err);
                    else res.json(data);
                })
            }
        });
    }
});

router.patch('/*', function(req, res, next) {
    if (req.url.substr(1) === '') res.status(400).json({error: 'invalid url'});
    else {
        User.findOne({name: req.url.substr(1)}, (err, user) => {
            if(!user) res.status(404).json({error:'user not found'});
            else{
                Object.assign(user, req.body).save((err, user) => {
                    if(err) res.send(err);
                    res.json({ message: 'User updated!', user });
                });
            }
        });
    }
});

router.delete('/*', function(req, res, next) {
    if (req.url.substr(1) === '') res.status(400).json({error: 'invalid url'});
    else {
        User.findOne({name: req.url.substr(1)}, function (err, user) {
            if(!user) res.status(404).json({error:'user not found'});
            else user.remove(function (err, data) {
                if (err) res.json(err);
                else res.json({msg: data.name + ' deleted successfully'});
            })
        });
    }
});

module.exports = router;
