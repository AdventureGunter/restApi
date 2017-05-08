let express = require('express');
let router = express.Router();
let User = require('../db/user');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/*router.get('/setup', function(req, res, next) {
    for (let x = 0; x <= 10; x++) {
      let user = new User({
          name: '123' + x,
          password: '123' + x
      })

        user.save((err) => {
          if (err) res.send(err);
        })
    }
});*/

module.exports = router;
