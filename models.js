var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    email: String,
    password: String
});

exports.User = mongoose.model('User', userSchema);

exports.init = function() {
	mongoose.connect('mongodb://localhost/login');
};
