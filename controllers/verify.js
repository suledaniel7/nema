var hash = require('password-hash');
var userSchema = require('./schemas/userSchema');

var verifyFn = function(req, res){
    var username = req.session.user.username,
    password = req.body.password;
    
    userSchema.findOne({username: username}, function(err, user){
        if(err) throw err;
        else {
            if (user === null || user === undefined){
                res.render('auth', {username: req.session.user.username, error: "Please ensure that your details are accurate"});
            }
            else {
                if (!hash.verify(password, user.password)){
                    res.render('auth', {username: req.session.user.username, error: "Please ensure that your details are accurate"});
                }
                else {
                    req.authsession.user = user;
                    res.redirect('settings');
                }
            }
        }
    });
}

module.exports = verifyFn;