var express = require('express');
var router = express.Router();

var User = require('../models/userModel');

router.post('/register', function (req, res) {
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;

    var newUser = new User({
        username: username,
        email: email,
        password: password,
        photoUrl: '',
    });

    User.createUser(newUser, function (err, user) {
        if (err) throw err;
        console.log(user);
    });

    req.flash('success_msg', 'You are registered');
    res.send('OK');
});

router.get('/test', function(req, res, next) {
    console.log(req.session.user);
    res.send(req.session.user);
})

router.post('/login', function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;

    User.getUserByName(username, function(err, user) {
        if(err) return next(err);
        if(!user) {
            res.status(404).send({message:"Unknown User"});
        } else {
            User.comparePassword(password, user.password, function(err, isMatch) {
            if(err) throw err;
            if(isMatch) {
                console.log('User logged in' + user);
                req.session.user = user;
                req.session.save();
                res.status(200).send({
                    id: user.id
                })

            } else {
                console.log(password);
                console.log(user.password);
                res.status(404).send({message:"Wrong password"});
            }})
        }
    })
})

router.post('/login/facebook', function(req, res) {
    console.log(req.body);
    User.getFacebookAccount(req.body.id, function(err, result) {
        if(err) throw err;
        if(!result) {
            console.log("create new user");
            User.createFacebookAccount(req.body, function(err, createdAccount) {
                if(err) throw err;
                res.status(200).send(createdAccount);
            })
        } else {
            console.log(result);
            req.session.user = result;
            req.session.save();
            res.status(200).send({
                id: result.id,
                name: result.name,
                email: result.email,
                photoUrl: result.photoUrl
            });
        }
    });
});

router.post('/login/google', function(req, res) {
    console.log(req.body);
    User.getGoogleAccount(req.body.id, function(err, result) {
        if(err) throw err;
        if(!result) {
            User.createGoogleAccount(req.body, function(err, createdAccount) {
                if(err) throw err;
                console.log(createdAccount);
                res.status(200).send(createdAccount);
            })
        } else {
            console.log(result);
            res.status(200).send({
                id: result.id,
                name: result.name,
                email: result.email,
                photoUrl: result.photoUrl
            })
        }
    })
})
router.get('/:id', function(req, res, next){
    console.log(req.params);
    User.getUserById(req.params.id, function(err, user) {
        if(err) throw err;
        else {
            if(!user) {
                res.status(404).send('User not found');
            } else {
                res.status(200).send({
                    name: user.name,
                    email: user.email,
                    photoUrl: user.photoUrl   
                })
            }
        }
    })
});

router.put('/:id', function(req, res, next) {
    var accType = req.params.accType;
    var updateInfo = req.body;
    console.log(updateInfo);
    User.getUserById(req.params.id, function(err, user) {
        if(err) throw err;
        else {
            if(!user) res.status(404).send('User not found');
            else {
                User.updateUser(req.params.id, updateInfo, function(err, updatedUser) {
                    if(err) return handleError(err);
                    res.status(200).send(updatedUser);
                });
            }
        }
    });
});


router.get('/login/logout', function (req, res, next) {
    console.log(req.session.user);
    if(req.session.user) {
        req.session.user = "";
        res.status(200).send('OK');
        console.log(req.session);
    }
});

module.exports = router;







