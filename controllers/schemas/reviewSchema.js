var mongoose = require('mongoose');
var schema = mongoose.Schema;

var reviewSchema = new schema({
    username: String,
    name: String,
    organisation: String,
    review: String,
    date: String,
    time: String,
    date_created: Date,
    orgName: String,
    uid: {unique: true, type: String}
});

reviewSchema.pre('save', function(next){
    this.date_created = new Date();
    next();
});

var reviewModel = mongoose.model('reviews', reviewSchema);

module.exports = reviewModel;