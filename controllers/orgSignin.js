var hash = require('password-hash');
var orgSchema = require('./schemas/orgSchema');

var orgFn = function(req, res){
    var username = req.body.username,
    password = req.body.password;
    
    orgSchema.findOne({username: username}, function(err, user){
        if(err){
            res.render('orgSignin', {error: 'Please ensure that your details are accurate'});
        }
        else if(user === null){
            res.render('orgSignin', {error: 'Please ensure that your details are accurate'});
        }
        else {
            if(hash.verify(!password, user.password)){
                res.render('orgSignin', {error: 'Please ensure that your details are accurate'});
            }
            else{
                req.orgsession.user = user;
                if(req.orgauthsession.user !== undefined){
                    req.orgauthsession.user = null;
                }
                //delete password
                res.redirect('/organisation/profile');
            }
        }
    });
}

module.exports = orgFn;