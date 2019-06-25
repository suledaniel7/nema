var orgSchema = require('./schemas/orgSchema');
var path = require('path');

var editFn = function(req, res){
    //firstly, render the page after replacing backslashes in thumbnail_path
    //secondly, design the page
    //next, implement the update
    //I got you, okay.
    var username = req.orgauthsession.user.username;
    
    orgSchema.findOne({username: username}, function(err, organisation){
        var loc = path.resolve(__dirname, '../public');
        var desc = organisation.description.toString();
        var description = desc.replace(/,/g, ' ');
        var relPath = path.relative(loc, organisation.thumbnail_path);
        organisation.description = description;
        var proPicPath = relPath.replace(/\\/g,'/');
        organisation.thumbnail_path = proPicPath;
        res.render('orgSettings', organisation);
    });
}

module.exports = editFn;