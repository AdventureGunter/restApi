/**
 * Created by User on 24.05.2017.
 */

module.exports.checkSessionForAut = (req, res, next) => {
    if (req.isAuthenticated()) {
        console.log('USER already at session');
        res.redirect('/');
    }
    else next();
};

module.exports.checkSessionForGet = (req, res, next) => {
    if (!req.isAuthenticated()) {
        console.log('User not authenticated');
        res.redirect('/');
    }
    else next();
};