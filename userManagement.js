var when           = require('when');
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

  var self = {
    authenticate: function(credentials) {
      return when.promise(function(resolve) {
        var email = credentials.email;
        models.User.findOne({ email: email }, function(err, obj) {
          if(obj !== null) {
            bcrypt.compare(credentials.password, obj.password, function(err, res) {
                if(res) {
                  resolve(createLoginResponse(credentials.email, true));
                  return;
                } else {
                  resolve(createLoginResponse(credentials.email, false));
                }
            });
          } else {
            resolve(createLoginResponse(credentials.email, false));
          }
        });
      });
    },
    createUser: function(email, password) {
      return when.promise(function(resolve) {
          bcrypt.hash(password, 8, function(err, hash) {
            var user = new models.User({ email: email, password: hash });
            user.save(function(err, obj) {
              resolve(obj);
            });
          });
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
