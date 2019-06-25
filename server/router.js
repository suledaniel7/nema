var express = require('express');
var userSchema = require('../controllers/schemas/userSchema');
var orgSchema = require('../controllers/schemas/orgSchema');
var bodyParser = require('body-parser');
var session = require('client-sessions');
var search = require('../controllers/search');
var signup = require('../controllers/signup');
var signin = require('../controllers/signin');
var profile = require('../controllers/profile');
var push = require('../controllers/push');
var follow = require('../controllers/follow');
var unfollow = require('../controllers/unfollow');
var review = require('../controllers/review');
var router = express.Router();
var urlEncodedParser = bodyParser.urlencoded({extended: true});

router.use(session({
    cookieName: 'session',
    secret: 'asdfghjkl',
    duration: 30*60*1000,
    activeDuration: 10*60*1000
}));

router.use(session({
    cookieName: 'orgsession',
    secret: 'asdfghjkl',
    duration: 30*60*1000,
    activeDuration: 10*60*1000
}));

function requireLogin(req, res, next){
    if(!req.session.user){
        console.log(req.originalUrl);
        res.redirect('/signin');
    }
    else{
        userSchema.findOne({username: req.session.user.username}, function(err, user){
            if(err){
                res.redirect('/signup');
            }
            else if(user === null){
                res.redirect('/signup');
            }
            else if(req.session.user.password !== user.password){
                res.render('signin', { error: "Some info changed since your last signin. Please verify your login details" });
            }
            else {
                next();
            }
        });
    }
}

var requireOrgLogin = function(req, res, next){
    if(!req.orgsession.user){
        res.redirect('/organisation/signin');
    }
    else{
        var username = req.orgsession.user.username;
        orgSchema.findOne({username: username}, function(err, user){
            if(err) {
                res.redirect('/organisation');
            }
            else if(user === null){
                res.redirect('/organisation');
            }
            else {
                if(user.password !== req.orgsession.user.password){
                    res.redirect('/organisation/signin', {error: 'Some information changed since your last login. Please login once more'});
                }
                else {
                    next();
                }
            }
        });
    }
}

router.get('/', function(req, res){
    if(req.session.user){
        res.redirect('/profile');
    }
    else {
        res.render('home');
    }
});

router.get('/signin', function(req, res){
    res.render('signin');
});

router.get('/signup', function(req, res){
    res.render('signup');
});

router.get('/profile', requireLogin, profile);

router.get('/contact', function(req, res){
    res.render('contact');
});

router.get('/about', function(req, res){
    res.render('about');
});

router.get('/search', search);

router.get('/follow/*', requireLogin, follow);

router.get('/unfollow/*', requireLogin, unfollow);

router.post('/create-acc', urlEncodedParser, signup);

router.post('/login', urlEncodedParser, signin);

router.post('/contact', urlEncodedParser, function(req, res){
    res.render('contact', {message: "Your Query has been sent. We'll get back to you"});
});

router.post('/push', requireOrgLogin, urlEncodedParser, push);

router.post('/review/*', requireLogin, urlEncodedParser, review);

module.exports = router;