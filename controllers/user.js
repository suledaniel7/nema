var orgSchema = require('./schemas/orgSchema');
var userSchema = require('./schemas/userSchema');
var notifsSchema = require('./schemas/notifsSchema');
var reviewSchema = require('./schemas/reviewSchema');
var path = require('path');

var userFn = function(req, res){
    var user = req.params[0];
    orgSchema.findOne({username: user}, function(err, org){
        if(err){
            res.render('organisation', {error: 'An error occured on our side. It has been reported to the site administrator. Check back within 24 hours. Thanks'});
            throw err;
        }
        else {
            var thumbnailNot = path.relative('c:/Users/suled/Downloads/Code/nHub/Nema/public', org.thumbnail_path);
            var thumbNew = thumbnailNot.replace('\\', '/');
            var thumbnail = thumbNew.replace('\\', '/');

            var locationer = org.location;
            locationer1 = locationer.replace(',,', ',');
            var location1 = locationer1.replace(',,', ',');

            notifsSchema.find({orgName: user}).sort({date_added: -1}).exec(function(err, data){
                if(req.session.user){
                    userSchema.findOne({username: req.session.user.username}, function(err, person){
                        if(err) throw err;
                        else {
                            var interests = person.interests;
                            var flag = true;
                            var followBtn ='';
                            if(interests.length === 0){
                                followBtn = '<a href="/follow/'+user+'">Follow</a>';
                            }
                            else {
                                interests.forEach(function(interest) {
                                    if(user === interest){
                                        followBtn = '<a title="Unfollow" href="/unfollow/'+user+'">Following</a>';
                                        flag = false;
                                    }
                                    else if(interests.indexOf(interest) === interests.length-1 && flag === true){
                                        followBtn = '<a href="/follow/'+user+'">Follow</a>';
                                    }
                                }, this);
                            }
                            
                            
                            var orgObj = {
                                username: org.username,
                                name: org.name,
                                email: org.email,
                                location: location1,
                                phNo: org.phone_number,
                                bio: org.bio,
                                thumbnail: thumbnail,
                                data: data,
                                followersNo: org.followersNo,
                                followBtn: followBtn,
                                canReview: true
                            }
                            
                            reviewSchema.find({orgName: user}).sort({date_created: -1}).exec(function(err, reviews){
                                if(err) throw err;
                                else {
                                    orgObj.reviews = reviews;
                                    res.render('organisation', orgObj);
                                }
                            });
                        }
                    })
                }
                else {
                    var followBtn = '<a href="/signin">Sign In to Follow</a>';
                    var orgObj = {
                        username: org.username,
                        name: org.name,
                        email: org.email,
                        location: location1,
                        phNo: org.phone_number,
                        bio: org.bio,
                        data: data,
                        thumbnail: thumbnail,
                        followersNo: org.followersNo,
                        followBtn: followBtn,
                        canReview: false,
                        reviewErr: 'You have to '+ '<a href="/signin">' +'sign in'+ '</a>' +' to review an organisation'
                    }
                    
                    reviewSchema.find({orgName: user}).sort({date_created: -1}).exec(function(err, reviews){
                        if(err) throw err;
                        else {
                            orgObj.reviews = reviews;
                            res.render('organisation', orgObj);
                        }
                    });
                }
            })
            
        }
    });
}

module.exports = userFn;