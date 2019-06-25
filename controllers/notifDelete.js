var notifsSchema = require('./schemas/notifsSchema');

function deleteFn (req, res){
    var uid = req.params[0];
    notifsSchema.findOneAndRemove({uid: uid}, function(err){
        if(err){
            throw err;
        }
        else {
            res.redirect('/organisation/profile');
        }
    });
}

module.exports = deleteFn;