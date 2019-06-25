var session = require('client-sessions');
var userSchema = require('./schemas/userSchema');
var hash = require('password-hash');

var signupFn = function(req, res){
    var username = req.body.username,
    fName = req.body.fName,
    lName = req.body.lName,
    gender = req.body.gender,
    bYear = req.body.bYear,
    plainPassword = req.body.password,
    email = req.body.email,
    d = new Date();

    var year = d.getFullYear(),
    month = d.getMonth(),
    age = year - bYear;
    monthArr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    rMonth = monthArr[month];

    var rDate = rMonth + " " + year;

    var password = hash.generate(plainPassword, {algorithm: 'sha256'});

    var newestUser = new userSchema({
        username: username,
        email: email,
        password: password,
        date_created: rDate,
        fName: fName,
        lName: lName,
        bYear: bYear,
        age: age,
        gender: gender,
        autoSugg: true,
        proPicPath: null
    });

    newestUser.save(function(err){
        if(err) {
            res.render('signup', {error: "A user exists with that username. Please choose another!"});
        }
        else {
            req.session.user = newestUser;
            res.redirect('/profile');
        }
    });
}

module.exports = signupFn;