const express = require('express');
const router = express.Router();
const User = require('../db/user');
const getUserByTocen = require('./getTocenHandler');

router.use(function(req, res, next) {
    getUserByTocen('/users', req, res, next);
});

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

router.post('/', function(req, res, next) {
    let name = req.body.name;
    let password = req.body.password;

    if(!name || !password) res.json({error: 'vvedi normalnie dannie. ueba'});

    else {
        User.findOne({name: req.body.name}, function (err, data) {
            if (err) res.json(err);
            if (data) res.json({error: 'user already exist'});
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
    User.update({_id: req.url.substr(1)}, {$set: {
        name: req.body.name,
        password: req.body.password
    }}, function (err, data) {
        if (err) res.json(err);
        else res.json(data);
    })
});

router.delete('/*', function(req, res, next) {
    User.findById(req.url.substr(1), function (err, data) {
        if (err) res.json(err);
        else data.remove(function (err, data) {
            if (err) res.json(err);
            else res.json({msg: data.name + ' deleted successfully'});
        })
    });

});

module.exports = router;
