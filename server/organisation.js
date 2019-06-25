var express = require('express');
var session = require('client-sessions');
var router = express.Router();
var bodyParser = require('body-parser');
var multer = require('multer');
var multerUpload = multer({dest: 'public/img/thumbnails'});
var xlsxUpload = multer({dest: 'public/xslx'});
var orgSignin = require('../controllers/orgSignin');
var upload = require('../controllers/upload');
var orgSchema = require('../controllers/schemas/orgSchema');
var orgProfile = require('../controllers/orgProfile');
var data_upload = require('../controllers/data-upload');
var past_data = require('../controllers/past-data');
var urlEncodedParser = bodyParser.urlencoded({extended: true});

router.use(session({
    cookieName: 'orgsession',
    secret: 'asdfghjkl',
    duration: 30*60*1000,
    activeDuration: 10*60*1000
}));

router.use(session({
    cookieName: 'orgauthsession',
    secret: 'asdfghjklzxcvbnm',
    duration: 5*60*1000,
    activeDuration: 2*60*1000
}));

var requireLogin = function(req, res, next){
    if(!req.orgsession.user){
        res.redirect('/organisation/signin');
    }
    else{
        var username = req.orgsession.user.username;
        orgSchema.findOne({username: username}, function(err, user){
            if(err) {
                throw err;
            }
            else if(user === null){
                res.redirect('/organisation');
            }
            else {
                if(user.password !== req.orgsession.user.password){
                    res.redirect('/organisation/signin');
                }
                else {
                    next();
                }
            }
        });
    }
}

router.get('/', function(req, res){
    res.render('orgSignup');
});

router.get('/signin', function(req, res){
    res.render('orgSignin');
});

router.get('/upload-data', requireLogin, function(req, res){
    res.render('upload-data', req.orgsession.user);
});

router.get('/past-data', requireLogin, past_data);

router.get('/profile', requireLogin, orgProfile);

router.post('/login', urlEncodedParser, orgSignin);

router.post('/upload', multerUpload.single('picture'), upload);

router.post('/data-upload', xlsxUpload.single('spreadsheet'), data_upload);

module.exports = router;