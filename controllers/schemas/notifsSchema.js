var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var notifsSchema = new Schema({
    orgName: String,
    fullName: String,
    text: String,
    date_added: Date,
    date: String,
    time: String,
    uid: {unique: true, type: String}
});

notifsSchema.pre('save', function(next){
    this.date_added = new Date();
    next();
});

var notifs = mongoose.model('notifs', notifsSchema);

module.exports = notifs;