var express        = require('express');
var _              = require('underscore');
var userManagement = require('../userManagement.js');
var bluebird       = require('bluebird');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  var user = userManagement.getUser(req);
  res.render('index', { user: user, isAuthenticated: userManagement.isAuthenticated(req) });
});

router.post('/login', function(req, res) {
  var credentials = _.pick(req.body, 'email', 'password');

  userManagement.authenticate(credentials).done(function(response) {
    if(response.success) {
      response.setCookie(res);
    }
    res.redirect('/');
  });
});

router.post('/logout', function(req, res) {
  userManagement.logout(res);

  res.redirect('/');
});

router.get('/user/create', function(req, res) {
  res.render('create-user');
});

router.post('/user/create', function(req, res) {
  userManagement.createUser(req.body.email, req.body.password).done(function(user) {
    res.redirect('/');
  });
});

module.exports = router;
