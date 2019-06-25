var userSchema = require('./schemas/userSchema');
var orgSchema = require('./schemas/orgSchema');

function unfollowFn(req, res){
    var orgName = req.params[0];
    var username = req.session.user.username;

    userSchema.findOne({username: username}, function(err, user){
        if(err){
            throw err;
        }
        else {
            var interests = user.interests;
            var index = interests.indexOf(orgName);
            interests.splice(index, 1);
            userSchema.findOneAndUpdate({username: username}, {interests: interests}, function(err){
                if(err) throw err;
                else {
                    orgSchema.findOne({username: orgName}, function(err, org){
                        if (err) throw err;
                        else {
                            var followers = org.followers;
                            var followersNo = org.followersNo;
                            var theIndex = followers.indexOf(username);
                            followers.splice(theIndex, 1);
                            followersNo--;
                            orgSchema.findOneAndUpdate({username: orgName}, {
                                followers: followers,
                                followersNo: followersNo
                            }, function(err){
                                if(err) throw err;
                                else {
                                    res.redirect('/user/'+orgName);
                                }
                            })
                        }
                    })
                }
            })
        }
    })
}

module.exports = unfollowFn;