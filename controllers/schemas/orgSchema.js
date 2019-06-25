var mongoose = require('mongoose');
var schema = mongoose.Schema;

var orgSchema = new schema({
    name: {type: String, required: true},
    fName: {type: String, required: true},
    username: {type: String, required: true, unique: true},
    description: {type: Array, required: true},
    email: {type: String, required: true},
    location: {type: String, required: true},
    fLocation: {type: String, required: true},
    phone_number: {type: String, required: true},
    thumbnail_path: {type: String, required: true},
    password: {type: String, required: true},
    sector: {type: String, required: true},
    bio: {type: String},
    followers: Array,
    followersNo: Number,
    fBio: String,
    date_created: String,
    date: Date
});

orgSchema.pre('save', function(next){
    this.date = new Date();
    next();
});

var orgModel = mongoose.model('organisations', orgSchema);

module.exports = orgModel;