var reviewSchema = require('./schemas/reviewSchema');

function reviewEditFn(req, res){
    var uid = req.params[0];
    reviewSchema.findOne({uid: uid}, function(err, review){
        if(err) throw err;
        else {
            res.render('reviewEdit', review);
        }
    });
}

module.exports = reviewEditFn;