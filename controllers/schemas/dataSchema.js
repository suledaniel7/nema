var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var dataSchema = new Schema({
    org_name: String,
    username: String,
    data_title: String,
    data: Array,
    params: Array,
    param_values: Array,
    values_array: Array
});

var dataModel = mongoose.model('data', dataSchema);

module.exports = dataModel;