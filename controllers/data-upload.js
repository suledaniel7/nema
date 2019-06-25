var xlsxj = require('xlsx-to-json');
var path = require('path');
var dataSchema = require('./schemas/dataSchema');

var dataFn = function(req, res){
    var dest = req.file.destination;
    var fName = req.file.filename;
    var fPath = path.join(__dirname, '../', dest , fName);
    var orgName = req.orgsession.user.name;
    var title = req.body.dataName;
    var username = req.orgsession.user.username;
    
    if(req.file.originalname.split('.')[req.file.originalname.split('.').length-1]!== 'xlsx'){
        res.render('upload-data', {error: "Only Excel spreadsheets are acceptable at this point in time"});
    }
    else{
        xlsxj({
            input: fPath,
            output: null
        }, function(err, result){
            if(err){
                throw err;
            }
            else {
                var paramArray = new Array;
                var param_values = new Array;
                var param_vals = new Array;
                var res_length = result.length;
                
                for (key in result[0]){
                    paramArray.push(key);
                }

                for (var i=0; i<res_length; i++){
                    paramArray.forEach(function(param) {
                        var obj = result[i];
                        param_values.push(obj[param]);
                    }, this);
                }

                param_values.forEach(function(value) {
                    if(param_vals.length < 1){
                        param_vals[0] = value;
                    }
                    else {
                        var flag = true;
                        for (var i=0; i < param_vals.length; i++){
                            if(param_vals[i] === value){
                                flag = false;
                            }
                            if(i === param_vals.length - 1 && flag === true){
                                param_vals.push(value);
                            }
                        }
                    }
                }, this);
                
                var keys = paramArray;
                var vals = param_vals;
                var keyArray = new Array;

                keys.forEach(function(key) {
                    var kName = key;
                    var fullKey = new Object;
                    fullKey[key] = new Array;
                    result.forEach(function(obj) {
                        fullKey[key].push(obj[key]);
                    }, this);
                    keyArray.push(fullKey);
                }, this);

                var objArray = new Array;
                
                function count(array, val, index){
                    var arrCounter = 0;
                    var valObj = new Object;
                    valObj[val] = 0;
                    for (i in array){
                        if (val === array[i]){
                            valObj[val] = valObj[val]+1;
                        }
                    }
                    return valObj[val];
                }

                var counter = -1;
                keys.forEach(function(param) {
                    var newObj = new Object;
                    counter++;
                    var newPosition = 0;
                    var enumerator = 0;
                    var flag = true;
                    var theArray = keyArray[counter][param];
                    var newestObj = new Object;
                    newestObj.name = param;
                    vals.forEach(function(val) {
                        var theCount = count(theArray, val, 0);
                        newestObj[val] = theCount;
                    }, this);
                    objArray.push(newestObj);
                }, this);
                
                var valArray = objArray;

                var dataObj = {
                    org_name: orgName,
                    username: username,
                    data_title: title,
                    data: result,
                    params: keys,
                    param_values: vals,
                    values_array: valArray
                }

                var newestData = new dataSchema(dataObj);
                
                var userObj = req.orgsession.user;
                userObj.message = 'Data uploaded successfully';

                newestData.save(function(err){
                    if(err) throw err;
                    else {
                        res.redirect('profile');
                    }
                    
                });
            }
        });
    }
    
}

module.exports = dataFn;