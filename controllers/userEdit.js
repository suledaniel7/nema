var path = require('path');
var userSchema = require('./schemas/userSchema');

var editFn = function (req, res){
    var username = req.session.user.username;
    var user1 = req.session.user;
    userSchema.findOne({username: username}, function(err, user){
        if(err) throw err;
        else {
            if(user.proPicPath === null){
                var proPicPath = 'img/png/avatar.png';
                user.proPicPath = proPicPath;
                res.render('settings', user);
            }
            else {
                var proPicPath = user.proPicPath.replace(/\\/g, '/');
                user.proPicPath = proPicPath;
                res.render('settings', user);
            }
        }
    });
}

module.exports = editFn;