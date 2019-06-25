var path = require('path');
var hash = require('password-hash');
var orgSchema = require('./schemas/orgSchema');

function orgUpdateFn(req, res){
    var thumbnail_path;
    
    if(req.file !== undefined){
        var dest = req.file.destination;
        var fName = req.file.filename;
        var proPicPath1 = path.join(__dirname, '../', dest , fName);
        var proPic = path.relative('c:/Users/suled/Downloads/Code/nHub/Nema/public', proPicPath1);
        var thumbnail_path = proPic.replace(/\\/g, '/');
        if(req.file.originalname.split('.')[req.file.originalname.split('.').length-1].toLowerCase()!== 'png' && req.file.originalname.split('.')[req.file.originalname.split('.').length-1].toLowerCase()!== 'jpg'){
            var userObj = req.orgsession.user;
            userObj.error = 'Only png and jpg files are acceptable';
        }
    }
    
    else {
        thumbnail_path = req.orgsession.user.thumbnail_path;
    }
    var password = null,
    hashedPassword = null;
    

    var username = req.body.username,
    originalUsername = req.orgsession.user.username,
    email = req.body.email,
    name = req.body.orgName,
    location = req.body.location,
    phone_number = req.body.phone_number,
    bio = req.body.bio,
    description = req.body.description.toLowerCase().split(' ');

    function test(a, b){
        if (a !== b){
            return false;
        }
        else {
            return true;
        }
    }
    
    orgSchema.findOne({username: originalUsername}, function(err, org){
        if(err){
            throw err;
        }
        else{
        if(req.body.password !== ''){
            password = req.body.password;
            hashedPassword = hash.generate(password, {algorithm: 'sha256'});
        }
        else {
            hashedPassword = org.password;
        }

        var rEmail = org.email,
        rName = org.name,
        rlocation = org.location,
        rphoneNumber = org.phone_number,
        rDescription = org.description,
        rBio = org.bio,
        nUsername,
        nEmail,
        nName,
        nLocation,
        nPhoneNumber,
        nBio,
        nDescription;
        if(test(username, originalUsername)){
            nUsername = originalUsername;
        }
        else {
            nUsername = username;
        }
        if(test(name, rName)){
            nName = rName;
        }
        else {
            nName = name;
        }
        if(test(email, rEmail)){
            nEmail = rEmail;
        }
        else {
            nEmail = email;
        }
        if(test(location, rlocation)){
            nLocation = rlocation;
        }
        else {
            nLocation = location;
        }
        if(test(phone_number, rphoneNumber)){
            nPhoneNumber = rphoneNumber;
        }
        else {
            nPhoneNumber = phone_number;
        }
        if(test(description, rDescription)){
            nDescription = rDescription;
        }
        else {
            nDescription = description;
        }
        if(test(bio, rBio)){
            nBio = rBio;
        }
        else {
            nBio = bio;
        }
        orgSchema.findOne({username: nUsername}, function(err, org1){
            if(err) throw err;
            else {
                if (userObj !== undefined){
                    var loc = path.resolve(__dirname, '../public');
                    var relPath = path.relative(loc, userObj.thumbnail_path);
                    var t_path = relPath.replace(/\\/g,'/');
                    userObj.thumbnail_path = t_path;
                    res.render('orgSettings', userObj);
                }
                else if(org1 !== [] && org1.username !== org.username){
                    var tmpObj = org;
                    tmpObj.error = "A user exists with that username. Please choose another!";
                    if(tmpObj.thumbnail_path === null){
                        tmpObj.thumbnail_path = 'img/png/avatar.png';
                    }
                    else {
                        var loc = path.resolve(__dirname, '../public');
                        var relPath = path.relative(loc, tmpObj.thumbnail_path);
                        var t_path = relPath.replace(/\\/g,'/');
                        tmpObj.thumbnail_path = t_path;
                    }
                    res.render('orgSettings', tmpObj);
                }
                else {
                    orgSchema.findOneAndUpdate({username: originalUsername}, {
                        username: nUsername,
                        password: hashedPassword,
                        email: nEmail,
                        name: nName,
                        fName: nName.toLowerCase(),
                        location: nLocation,
                        fLocation: nLocation.toLowerCase(),
                        description: nDescription,
                        bio: nBio,
                        fBio: nBio.toLowerCase(),
                        phone_number: nPhoneNumber,
                        thumbnail_path: thumbnail_path
                    }, function(err, user2){
                        if(err) {
                            var tmpObj = org;
                            tmpObj.error = "A user exists with that username. Please choose another!";
                            if(tmpObj.thumbnail_path === null){
                                tmpObj.thumbnail_path = 'img/png/avatar.png';
                            }
                            else {
                                var loc = path.resolve(__dirname, '../public');
                                var relPath = path.relative(loc, tmpObj.thumbnail_path);
                                var t_path = relPath.replace(/\\/g,'/');
                                tmpObj.thumbnail_path = t_path;
                            }
                            res.render('orgSettings', tmpObj);
                        }
                        else {
                            var userObj = user2;
                            userObj.success = 'Account Updated successfully!';
                            
                            if(userObj.thumbnail_path === null){
                                userObj.thumbnail_path = 'img/png/avatar.png';
                            }
                            userObj.thumbnail_path = thumbnail_path;
                            req.orgsession.user = user2;
                            req.orgauthsession.user = user2;
                            res.redirect('/organisation/profile');
                        }
                    });
                }
            }
        });
    }
    });
}

module.exports = orgUpdateFn;