var userSchema = require('./schemas/userSchema');
var orgSchema = require('./schemas/orgSchema');

function followFn(req, res){
    var orgName = req.params[0];
    var username = req.session.user.username;

    userSchema.findOne({username: username}, function(err, user){
        if(err) throw err;
        else {
            var interests = user.interests;
            interests.push(orgName);
            userSchema.findOneAndUpdate({username: username}, {
                interests: interests
            }, function(err){
                if(err) throw err;
                else {
                    orgSchema.findOne({username: orgName}, function(err, org){
                        var followers = org.followers;
                        var followerNo = org.followersNo;
                        followers.push(username);
                        followerNo++;
                        orgSchema.findOneAndUpdate({username: orgName}, {
                            followers: followers,
                            followersNo: followerNo
                        }, function(err){
                            if(err) throw err;
                            else {
                                res.redirect('/user/'+orgName);
                            }
                        });
                    });
                }
            });
        }
        
    });

}

function theFn(req, res){
    orgSchema.find({}, function(err, orgs){
        orgs.forEach(function(org) {
            orgSchema.findOneAndInsert({username: org}, {
                followerNo: 0,
                followers: []
            }, function(err){
                if(err) throw err;
                else {
                    console.log('Aiit');
                }
            });
        }, this);
    });
}

module.exports = followFn;