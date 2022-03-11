// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/.well-known/acme-challenge/:code', function(req, res, next) {
  const urlCode = req.params.code;
  res.status(200).send(urlCode + ".We3gegYJeuLs3EAQ1YzHarZr73AB_M6xg0YGvRuoy7M");
});

module.exports = router;
