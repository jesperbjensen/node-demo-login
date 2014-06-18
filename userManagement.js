var bluebird       = require('bluebird');
var models         = require('./models.js');
var bcrypt         = require('bcrypt');

module.exports = function() {

  var createLoginResponse = function(email, success) {
    return {
      success: success,
      message: (success === true && "Successfull") || "Failed",
      setCookie: function(res) {
        res.cookie('user', email, {signed: true, path: '/'});
      }
    };
  };

  function findUser(email) {
    return bluebird.promisify(models.User.findOne.bind(models.User))({ email: email });
  }

  function validatePassword(obj, password) {
    return bluebird.promisify(bcrypt.compare)(password, obj.password).then(function(res) {
        return {valid: res, user: obj};
    });
  }

  function saveUser(user) {
    return bluebird.promisify(user.save.bind(user))();
  }

  function hashPassword(password) {
    return bluebird.promisify(bcrypt.hash)(password, 8);
  }

  var self = {

    authenticate: function(credentials) {
      var email = credentials.email;

      return findUser(email).then(function(obj) {
        return validatePassword(obj, credentials.password);
      }).then(function(result) {
        return createLoginResponse(result.user.email, result.valid);
      });
    },

    createUser: function(email, password) {
      return hashPassword(password).then(function(hash) {
        var user = new models.User({ email: email, password: hash });
        return saveUser(user);
      });
    },

    getUser: function(req) {
      return req.signedCookies.user || null;
    },

    isAuthenticated: function(req) {
      return self.getUser(req) !== null;
    },

    logout: function(res) {
      res.clearCookie('user');
    }

  };
  return self;
}();
