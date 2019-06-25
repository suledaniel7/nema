var hash = require('password-hash');
var orgSchema = require('./schemas/orgSchema');

var verifyFn = function(req, res){
    var username = req.orgsession.user.username,
    password = req.body.password;
    
    orgSchema.findOne({username: username}, function(err, user){
        if(err) throw err;
        else {
            if (user === null || user === undefined){
                res.render('orgauth', {username: req.orgsession.user.username, error: "Please ensure that your details are accurate"});
            }
            else {
                if (!hash.verify(password, user.password)){
                    res.render('orgauth', {username: req.orgsession.user.username, error: "Please ensure that your details are accurate"});
                }
                else {
                    req.orgauthsession.user = user;
                    res.redirect('org-settings');
                }
            }
        }
    });
}

module.exports = verifyFn;