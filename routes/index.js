var express        = require('express');
var _              = require('underscore');
var userManagement  = require('../userManagement.js');
var when           = require('when');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  var user = userManagement.getUser(req);
  res.render('index', { user: user, isAuthenticated: userManagement.isAuthenticated(req) });
});

router.post('/login', function(req, res) {
  var credentials = _.pick(req.body, 'email', 'password');

  userManagement.authenticate(credentials).then(function(response) {
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

module.exports = router;
