var path = require('path');
var hash = require('password-hash');
var orgSchema = require('./schemas/orgSchema');

var uploadFn = function(req, res){
    var dest = req.file.destination;
    var fName = req.file.filename;
    var fPath = path.join(__dirname, '../', dest , fName);
    
    var d = new Date();

    var year = d.getFullYear(),
    month = d.getMonth(),
    monthArr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    rMonth = monthArr[month];

    var rDate = rMonth + " " + year;

    var orgName = req.body.orgName,
    fName = req.body.orgName.toLowerCase(),
    username = req.body.username,
    email = req.body.email.toLowerCase(),
    rlocation = req.body.location,
    location = req.body.location.toLowerCase(),
    phNumber = req.body.number.toLowerCase(),
    password = hash.generate(req.body.password, {algorithm: 'sha256'}),
    sector = req.body.sector.toLowerCase(),
    description = req.body.description.toLowerCase(),
    bio = req.body.bio,
    fBio = req.body.bio.toLowerCase();

    var descriptions = description.split(" ");
    var locations = location.split(" ");
    

    var organisation = new orgSchema({
        name: orgName,
        fName: fName,
        username: username,
        description: descriptions,
        email: email,
        location: rlocation,
        fLocation: locations,
        phone_number: phNumber,
        thumbnail_path: fPath,
        followersNo: 0,
        password: password,
        sector: sector,
        bio: bio,
        fBio: fBio,
        date_created: rDate
    });

    organisation.save(function(err){
        if(err){
            res.render('orgSignup', {error: "A user already exists with that username. Please choose another"});
            throw err;
        }
        else {
            console.log("Organisation added!");
            req.orgsession.user = organisation;
            res.redirect('/organisation/profile');
        }
    });
}

module.exports = uploadFn;