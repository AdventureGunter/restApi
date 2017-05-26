const express = require('express');
const router = express.Router();

const User = require('../db/user');
const userController = require('../controllers/usersController.js');

/*router.use(function(req, res, next) {
 getUserByTocen('/users', req, res, next);
 });*/

/* GET users listing. */
router.get('/', function(req, res, next) {
    User.find()
        .then(data =>{
            res.json(data);
        }).catch(err => next(err));

});

router.get('/:id', userController.checkUserID, function(req, res, next) {
    User.findById(req.params.id).then((err, data) => {
        res.json(data);
    }).catch(err => next(err));
});

router.use(userController.isAut);

/*
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
 */

router.patch('/:id', userController.checkUserID, userController.checkBodyCustom, function(req, res, next) {
    User.findById(req.params.id)
        .then(user => {
            if(!user) res.status(404).json({error:'user not found'});
            else{
                Object.assign(user, req.body).save()
                    .then(user => {
                        res.json({ message: 'User updated!', user });
                    })
                    .catch(err => next(err));
            }
        })
        .catch(err => next(err));
});

router.delete('/:id', userController.checkUserID, function(req, res, next) {
    User.findOne({name: req.params.id})
        .then(user => {
            if(!user) res.status(404).json({error:'user not found'});
            else user.remove().then((err, data) => {
                res.json({msg: data.name + ' deleted successfully'});
            }).catch(err => next(err))
        })
        .catch(err => next(err));
});

module.exports = router;
