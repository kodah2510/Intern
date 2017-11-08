var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');

var mongo = require('mongodb');
var mongoose = require('mongoose');


//connect to the database
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function() {
    console.log('connected to database');
});

var users = require('./routes/users');

// Init App
var app = express();

//bodyParse
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
    secret: 'secret',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 60000,
    }
}));

app.use(flash());

app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    //res.local.user = req.user || null;
    next();
});

app.post('/' ,function (req, res, next) {
   console.log(req.session);
   res.send('OK');
});
app.get('/', function(req, res, next) {
    res.status(200).cookie(req.session.cookie).send('cookie has been sent');
});

app.use('/users', users);

//set port
app.set('port', (3000));
app.listen(app.get('port'), function () {
    console.log('Server started on port ' + app.get('port'));
});

