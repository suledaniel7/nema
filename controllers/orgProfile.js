var path = require('path');
var orgSchema = require('./schemas/orgSchema');
var notifsSchema = require('./schemas/notifsSchema');
var reviewSchema = require('./schemas/reviewSchema');

var orgFn = function(req, res){
    var username = req.orgsession.user.username;
    orgSchema.findOne({username: username}, function(err, user){
        if(err) {
            res.redirect('/organisation');
        }
        else {
            notifsSchema.find({orgName: username}).sort({date_added: -1}).exec(function(err, notifs){
                var proPic = path.relative('c:/Users/suled/Downloads/Code/nHub/Nema/public', user.thumbnail_path);
                var proPicPath = proPic.replace(/\\/g, '/');
                user.proPicPath = proPicPath;
                user.notifications = notifs;

                reviewSchema.find({orgName: username}).sort({date_created: -1}).exec(function(err, reviews){
                    user.reviews = reviews;
                    if(reviews.length === 0){
                        user.noReviews = "You have no reviews yet";
                    }
                    res.render('orgProfile', user);
                });
            });
            
        }
    });
}

module.exports = orgFn;