var reviewSchema = require('./schemas/reviewSchema');

function reviewUpdateFn(req, res){
    var uid = req.params[0];
    var review = req.body.review;

    reviewSchema.findOneAndUpdate({uid: uid}, {review: review}, function(err){
        if(err){
            throw err;
        }
        else {
            res.redirect('/profile');
        }
    });
}

module.exports = reviewUpdateFn;