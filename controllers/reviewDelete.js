var reviewSchema = require('./schemas/reviewSchema');

function reviewDeleteFn(req, res){
    var uid = req.params[0];
    reviewSchema.findOneAndRemove({uid: uid}, function(err){
        if(err){
            throw err;
        }
        else {
            res.redirect('/profile');
        }
    });
}

module.exports = reviewDeleteFn;