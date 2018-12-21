"use strict";

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Main Page' });
});

/* GET users listing. */
router.get('/users', function(req, res, next) {
  res.render('registration', { title: 'Register new user' });
});

module.exports = router;
