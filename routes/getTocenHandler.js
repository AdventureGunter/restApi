/**
 * Created by Стас on 08.05.2017.
 */
const jwt    = require('jsonwebtoken');

module.exports = function getUserByTocen(url, req, res, next) {
    if (url === '/users' && req.method === 'GET') next();
    else {
        let token = req.body.token || req.param('token') || req.headers['x-access-token'];

        if (token) {
            jwt.verify(token, 'lalala', function(err, decoded) {
                if (err) {
                    return res.status(400).json({ success: false, ErrorCode : "invalid_request", Error :"Invalid Authorization Code" });
                } else {
                    req.decoded = decoded;
                    //console.log(decoded._doc);
                    //console.log(url);
                    if (url === '/users') next();
                    if (url === '/session')res.status(200).json(decoded._doc);
                }
            });
        } else {
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });
        }
    }
};