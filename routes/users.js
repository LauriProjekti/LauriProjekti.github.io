"use strict";

var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('registration', { title: 'Register new user' });
});

module.exports = router;
