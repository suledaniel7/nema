var dataSchema = require('./schemas/dataSchema');

var calcFn = function(req, res){
    var username = req.session.user.username;

    dataSchema.findOne({username: username, new: true}, function(err, data){
        console.log(data);
    })
}

module.exports = calcFn;