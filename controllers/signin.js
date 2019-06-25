var userSchema = require('./schemas/userSchema');
var hash = require('password-hash');

var signinFn = function(req, res){
    var username = req.body.username,
    password = req.body.password;

    userSchema.findOne({username: username}, function(err, user){
        if(err){
            res.render('signin', {error: "Please ensure that your details are accurate"});
        }
        else if(user === null){
            res.render('signin', {error: "Please ensure that your details are accurate"});
        }
        else if(!hash.verify(password, user.password)){
            res.render('signin', {error: "Please ensure that your details are accurate"});
        }
        else {
            req.session.user = user;
            res.redirect('/profile');
        }
    });
}

module.exports = signinFn;