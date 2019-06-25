var path = require('path');
var hash = require('password-hash');
var userSchema = require('./schemas/userSchema');

var updateFn = function(req, res){
    var proPicPath;
    
    if(req.file !== undefined){
        var dest = req.file.destination;
        var fName = req.file.filename;
        var proPicPath1 = path.join(__dirname, '../', dest , fName);
        var proPic = path.relative('c:/Users/suled/Downloads/Code/nHub/Nema/public', proPicPath1);
        var proPicPath = proPic.replace(/\\/g, '/');
        if(req.file.originalname.split('.')[req.file.originalname.split('.').length-1].toLowerCase()!== 'png' && req.file.originalname.split('.')[req.file.originalname.split('.').length-1].toLowerCase()!== 'jpg'){
            var userObj = req.session.user;
            userObj.error = 'Only png and jpg files are acceptable';
        }
    }
    else if(req.session.user.proPicPath === null){
        proPicPath = 'img/png/avatar.png';
    }
    else {
        proPicPath = req.session.user.proPicPath;
    }
    var password = null,
    hashedPassword = null;
    

    var username = req.body.username,
    originalUsername = req.session.user.username,
    email = req.body.email,
    fName = req.body.fName,
    lName = req.body.lName,
    autoSugg = req.body.autoSugg;

    function test(a, b){
        if (a !== b){
            return false;
        }
        else {
            return true;
        }
    }
    
    userSchema.findOne({username: originalUsername}, function(err, user){
        if(req.body.password !== ''){
            password = req.body.password;
            hashedPassword = hash.generate(password, {algorithm: 'sha256'});
        }
        else {
            hashedPassword = user.password;
        }

        var rEmail = user.email,
        rFName = user.fName,
        rLName = user.lName,
        rAutoSugg = user.autoSugg,
        nUsername,
        nEmail,
        nFName,
        nLName,
        nAutoSugg;
        if(test(username, originalUsername)){
            nUsername = originalUsername;
        }
        else {
            nUsername = username;
        }
        if(test(fName, rFName)){
            nFName = rFName;
        }
        else {
            nFName = fName;
        }
        if(test(email, rEmail)){
            nEmail = rEmail;
        }
        else {
            nEmail = email;
        }
        if(test(lName, rLName)){
            nLName = rLName;
        }
        else {
            nLName = lName;
        }
        if(autoSugg == 'yes'){
            nAutoSugg = true;
        }
        else {
            nAutoSugg = false;
        }
        userSchema.findOne({username: nUsername}, function(err, user1){
            if(err) throw err;
            else {
                if (userObj !== undefined){
                    res.render('settings', userObj);
                }
                else if(user1 !== [] && user1.username !== user.username){
                    var tmpObj = user;
                    tmpObj.error = "A user exists with that username. Please choose another!";
                    if(tmpObj.proPicPath === null){
                        tmpObj.proPicPath = 'img/png/avatar.png';
                    }
                    res.render('settings', tmpObj);
                }
                else {
                    userSchema.findOneAndUpdate({username: originalUsername}, {
                        username: nUsername,
                        password: hashedPassword,
                        email: nEmail,
                        fName: nFName,
                        lName: nLName,
                        proPicPath: proPicPath,
                        autoSugg: nAutoSugg
                    }, function(err, user2){
                        if(err) {
                            var tmpObj = user;
                            tmpObj.error = "A user exists with that username. Please choose another!";
                            if(tmpObj.proPicPath === null){
                                tmpObj.proPicPath = 'img/png/avatar.png';
                            }
                            res.render('settings', tmpObj);
                        }
                        else {
                            var userObj = user2;
                            userObj.success = 'Account Updated successfully!';
                            
                            if(userObj.proPicPath === null){
                                userObj.proPicPath = 'img/png/avatar.png';
                            }
                            userObj.proPicPath = proPicPath;
                            req.session.user = user2;
                            req.authsession.user = user2;
                            res.redirect('/profile');
                        }
                    });
                }
            }
        });

    });
}

module.exports = updateFn;