var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var FacebookAccountSchema = mongoose.Schema({
    id: { type: String, unique: true },
    name: { type: String },
    email: { type: String },
    photoUrl: {type: String}
});

var GoogleAccountSchema = mongoose.Schema({
    id: { type: String, unique: true },
    name: { type: String },
    email: { type: String },
    photoUrl: { type: String }
});

var UserSchema = mongoose.Schema({
    name: { type: String, index: true },
    password: { type: String },
    email: { type: String },
    photoUrl: { type: String }
});
var GoogleAccount = module.exports = mongoose.model('GoogleAccount', GoogleAccountSchema, 'googleAccount');
var FacebookAccount = module.exports = mongoose.model('FacebookAccount', FacebookAccountSchema, 'facebookAccount');
var User = module.exports = mongoose.model('User', UserSchema, 'usersInfo');
//CRUD
//normal user
module.exports.createUser = function (newUser, callback) {
    newUser.save(callback);
}
module.exports.readUser = function (query, callback) {
    User.find(query, callback);
}
module.exports.updateUser = function (userId, updateInfo, callback) {
    User.findById(userId, function(err, user) {
        user.set({
            name: updateInfo.name,
            email: updateInfo.email,
            photoUrl: updateInfo.photoUrl
        });
        user.save(callback);
    } );
}
module.exports.deleteUser = function (curUser, callback) {
    User.delete(callback);
}
//facebook
module.exports.createFacebookAccount = function (profile, callback) {
    var newAccount = new FacebookAccount({
        id: profile.id,
        name: profile.name,
        email: profile.email,
        photoUrl: profile.photoUrl
    });
    newAccount.save(callback);
}

//google
module.exports.createGoogleAccount = function (profile, callback) {
    var newAccount = new GoogleAccount({
        id: profile.id,
        name: profile.name,
        email: profile.email,
        photoUrl: profile.photoUrl
    });
    newAccount.save(callback);
}
///
module.exports.getUserByName = function (username, callback) {
    var query = { name: username };
    User.findOne(query, callback);
}
module.exports.getUserById = function (id, callback) {
    User.findById(id, callback);
}
module.exports.getFacebookAccount = function (userId, callback) {
    var query = { id: userId };
    FacebookAccount.findOne(query, callback);
}
module.exports.getGoogleAccount = function (userId, callback) {
    var query = { id: userId };
    GoogleAccount.findOne(query, callback);
}
module.exports.comparePassword = function (candidatePassword, password, callback) {
    var isMatch = false;
    if (candidatePassword == password) 
        isMatch = true;
    callback(null, isMatch);
}