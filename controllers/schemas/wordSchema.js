var mongoose = require('mongoose');
var schema = mongoose.Schema;

var wordSchema = new schema({
    words: Array
});

var words = mongoose.model('corpus', wordSchema);

module.exports = words;