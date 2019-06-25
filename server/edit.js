var express = require('express');
var session = require('client-sessions');
var bodyParser = require('body-parser');
var multer = require('multer');
var multerUpload = multer({dest: 'public/img/avatars'});
var userSchema = require('../controllers/schemas/userSchema');
var orgSchema = require('../controllers/schemas/orgSchema');
var uEdit = require('../controllers/userEdit');
var orgEdit = require('../controllers/orgEdit');
var verify = require('../controllers/verify');
var orgVerify = require('../controllers/orgVerify');
var uUpdate = require('../controllers/uUpdate');
var notifs = require('../controllers/notifsEdit');
var notifsUpdate = require('../controllers/notifsUpdate');
var reviews = require('../controllers/reviewEdit');
var reviewUpdate = require('../controllers/reviewUpdate');
var orgUpdate = require('../controllers/orgUpdate');

var router = express.Router();
var urlEncodedParser = bodyParser.urlencoded({extended: true});

router.use(session({
    cookieName: 'authsession',
    secret: 'asdfghjklzxcvbnm',
    duration: 5*60*1000,
    activeDuration: 2*60*1000
}));

router.use(session({
    cookieName: 'orgauthsession',
    secret: 'asdfghjklzxcvbnm',
    duration: 5*60*1000,
    activeDuration: 2*60*1000
}));

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

function requireAuthLogin(req, res, next){
    if(!req.authsession.user){
        res.render('auth', {username: req.session.user.username, warning: "As you're accessing sensitive information, we need you to confirm your details"});
    }
    else{
        userSchema.findOne({username: req.authsession.user.username}, function(err, user){
            if(err) {
                res.render('auth', {username: req.session.user.username, error: "Please ensure that your details are accurate"});
            }
            else if(user === null || user === undefined){
                res.render('auth', {username: req.session.user.username, error: "Please ensure that your details are accurate"});
            }
            else if(req.authsession.user.password !== user.password){
                res.render('auth', {username: req.session.user.username, error: "Please ensure that your details are accurate"});
            }
            else {
                next();
            }
        });
    }
}

function requireOrgAuthLogin(req, res, next){
    if(!req.orgauthsession.user){
        res.render('orgauth', {username: req.orgsession.user.username, warning: "As you're accessing sensitive information, we need you to confirm your details"});
    }
    else{
        orgSchema.findOne({username: req.orgauthsession.user.username}, function(err, user){
            if(err) {
                res.render('orgauth', {username: req.orgsession.user.username, error: "Please ensure that your details are accurate"});
            }
            else if(user === null || user === undefined){
                res.render('orgauth', {username: req.orgsession.user.username, error: "Please ensure that your details are accurate"});
            }
            else if(req.orgauthsession.user.password !== user.password){
                res.render('orgauth', {username: req.orgsession.user.username, error: "Please ensure that your details are accurate"});
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

router.get('/user/', requireLogin, requireAuthLogin, uEdit);

router.get('/org/', requireOrgLogin, requireOrgAuthLogin, orgEdit);

router.get('/settings', requireLogin, requireAuthLogin, uEdit);

router.get('/notifications/*', requireOrgLogin, notifs);

router.get('/reviews/*', requireLogin, reviews);

router.get('/org-settings', requireOrgLogin, requireOrgAuthLogin, orgEdit);

router.post('/verify', urlEncodedParser, verify);

router.post('/org-verify', urlEncodedParser, orgVerify);

router.post('/update', multerUpload.single('proPic'), uUpdate);

router.post('/update/notification/*', urlEncodedParser, notifsUpdate);

router.post('/update/review/*', urlEncodedParser, reviewUpdate);

router.post('/organisation-update', requireOrgAuthLogin, multerUpload.single('thumbnail_photo'), orgUpdate);

module.exports = router;