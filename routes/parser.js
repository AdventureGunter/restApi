const express = require('express');
const router = express.Router();
const parser = require('../regex_parser/index');


router.post('/', function(req, res, next) {
    console.log('parser rabotaet');
    let resJson = parser(req.body.url);
    resJson
        .then(resJson => {
            //console.log(resJson);
            res.json(JSON.parse(resJson));
        }).catch(err => {console.log(err)});


    //;

});

module.exports = router;
