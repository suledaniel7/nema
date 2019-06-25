var mongoose = require('mongoose');
var schema = mongoose.Schema;

var userSchema = new schema({
    username: {type: String, required: true, unique: true},
    fName: {type: String, required: true},
    lName: {type: String, required: true},
    bYear: Number,
    age: Number,
    gender: String,
    password: {type: String, required: true},
    email: {type: String, required: true},
    date_created: String,
    proPicPath: String,
    date: Date,
    autoSugg: Boolean,
    interests: Array
});

userSchema.pre('save', function(next){
    this.date = new Date();
    next();
});

var userModel = mongoose.model('users', userSchema);

module.exports = userModel;