var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Mavericks Movie Blog' });
});

router.get('/post', function(req, res, next) {
  res.render('post', { title: 'Movie Name - Mavericks Movie Blog'});
});

module.exports = router;
