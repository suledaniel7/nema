var path = require('path');
var userSchema = require('./schemas/userSchema');
var notifsSchema = require('./schemas/notifsSchema');
var reviewSchema = require('./schemas/reviewSchema');

var profileFn = function(req, res){
    var username = req.session.user.username;
    var notifsArray = new Array();
    userSchema.findOne({username: username}, function(err, user){
        if(err) throw err;
        else{
            reviewSchema.find({username: username}).sort({date_created: -1}).exec(function(err, reviews){
                if(err) throw err;
                else {
                    var interests = user.interests;
                    user.reviews = reviews;
                    if(reviews.length === 0){
                        user.noReviews = "You have not reviewed any organisations yet.";
                    }
                    var number = interests.length;
                    if (number === 0){
                        if(user.proPicPath === null){
                            var proPicPath = 'img/png/avatar.png';
                            user.proPicPath = proPicPath;
                        }
                        else {
                            var proPicPath = user.proPicPath.replace(/\\/g, '/');
                            user.proPicPath = proPicPath;
                        }
                        user.noActivity = 'You have no recent activity. Follow an organisation to view their notifications on your News Feed';
                        res.render('profile', user);
                    }
                    else {
                        interests.forEach(function(element) {
                            notifsSchema.find({orgName: element}).sort({date_added: -1}).exec(function(err, notifs){
                                if(err) throw err;
                                else {
                                    notifsArray.push(notifs);
                                    if(interests.indexOf(element) === number-1){
                                        if(notifsArray[0].length === 0){
                                            if(user.proPicPath === null){
                                                var proPicPath = 'img/png/avatar.png';
                                                user.proPicPath = proPicPath;
                                            }
                                            else {
                                                var proPicPath = user.proPicPath.replace(/\\/g, '/');
                                                user.proPicPath = proPicPath;
                                            }
                                            user.noActivity = 'You have no recent activity. Follow an organisation to view their notifications on your News Feed';
                                            res.render('profile', user);
                                        }
                                        else {
                                            var first = notifsArray[0];
                                            
                                            if(user.proPicPath === null){
                                                var proPicPath = 'img/png/avatar.png';
                                                user.proPicPath = proPicPath;
                                            }
                                            else {
                                                var proPicPath = user.proPicPath.replace(/\\/g, '/');
                                                user.proPicPath = proPicPath;
                                            }
                                            // user.noActivity = 'You have no recent activity';
                                            user.data = first;
                                            res.render('profile', user);
                                        }
                                    }
                                }
                            })
                        }, this);
                    }
                }
            });
        }
            
            


            
        
    })
    
}

module.exports = profileFn;