/**
 * Created by User on 24.05.2017.
 */
let util = require('util');

module.exports.checkUserID = function (req, res, next) {
    req.checkParams('urlparam', 'Invalid urlparam').isAlpha();
    req.getValidationResult()
        .then(result => {
            if (!result.isEmpty()) {
                res.status(400).send('There have been validation errors: ' + util.inspect(result.array()));
                return;
            }
            next();
        }).catch(err => next(err))
};

module.exports.checkBodyCustom = function (req, res, next) {
    req.checkBody('body', 'Invalid body').notEmpty();
    req.getValidationResult()
        .then(result => {
            if (!result.isEmpty()) {
                res.status(400).send('There have been validation errors: ' + util.inspect(result.array()));
                return;
            }
            next();
        }).catch(err => next(err))
};

module.exports.isAut = (req, res, next) => {
    if (!req.isAuthenticated()) {
        console.log('User not authenticated');
        res.redirect('/');
    }
    else next();
};