var when           = require('when');

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
      if(credentials.email == "deldy@deldysoft.dk" && credentials.password == "123456") {
        return when(createLoginResponse(credentials.email, true));
      }

      return when(createLoginResponse(credentials.email, false));
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
