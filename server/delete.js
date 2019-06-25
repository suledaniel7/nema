var express = require('express');
var session = require('client-sessions');
var bodyParser = require('body-parser');
var userSchema = require('../controllers/schemas/userSchema');
var orgSchema = require('../controllers/schemas/orgSchema');
var notifDel = require('../controllers/notifDelete');
var reviewDel = require('../controllers/reviewDelete');

var router = express.Router();
var urlEncodedParser = bodyParser.urlencoded({extended: true});

router.use(session({
    cookieName: 'orgsession',
    secret: 'asdfghjkl',
    duration: 30*60*1000,
    activeDuration: 10*60*1000
}));

function requireLogin(req, res, next){
    if(!req.session.user){
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

router.get('/notifications/*', notifDel);

router.get('/reviews/*', reviewDel);

module.exports = router;