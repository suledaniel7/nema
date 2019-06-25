var dataSchema = require('./schemas/dataSchema');

var statFn = function(req, res){
    
    var uName = req.params[0];
    
    dataSchema.findOne({username: uName}, function(err, data){
        if(err || data === null || data === []){
            res.render('stats', {
                message: "No statistics found",
                username: uName
            });
        }
        else {
            var name = data.org_name,
            title = data.data_title,
            valsArr = data.values_array,
            paramVals = data.param_values,
            parameters = data.data;

            var totalsArr = new Array;
            valsArr.forEach(function(obj) {
                var parName = obj.name;
                var total = 0;
                
                for (var i =1; i < paramVals.length; i++){
                    total += obj[paramVals[i]];
                }
                
                var newestObj = new Object;
                newestObj.name = parName;
                newestObj.total = total;
                totalsArr.push(newestObj);
            }, this);

            
            var percVals = new Array;
            
            valsArr.forEach(function(val) {
                var name = val.name;
                var percObj = new Object;
                percObj.name = name;
                var percArray = new Array;
                totalsArr.forEach(function(elem) {
                    if(elem.name === name){
                        paramVals.forEach(function(param) {
                            if(param !== ''){
                                var numerator = val[param];
                                var denominator = elem.total;
                                var percentage = (numerator/denominator)*100;
                                percentage = percentage.toFixed(2);
                                var newObj = new Object;
                                newObj.title = param;
                                newObj.percentage = percentage + "%";
                                percArray.push(newObj);
                            }
                            
                        }, this);
                    }
                }, this);
                percArray.sort(function(a, b){
                    var nameA = a.title.toLowerCase(),
                    nameB = b.title.toLowerCase();

                    if(nameA < nameB){
                        return -1
                    }
                    if (nameA > nameB) {
                        return 1
                    }
                    return 0
                });
                percObj.percentages = percArray;
                percVals.push(percObj);
            }, this);

            var percentages = percVals;
            
            percentages.sort(function(a, b){
                var nameA = a.name.toLowerCase(),
                nameB = b.name.toLowerCase();

                if(nameA < nameB){
                    return -1
                }
                if (nameA > nameB) {
                    return 1
                }
                return 0
            });

            var dataObj = {
                name: name,
                title: title,
                vals: valsArr,
                totals: totalsArr,
                parameters: paramVals.sort(),
                percentages: percentages,
                username: uName
            }
            res.render('stats', dataObj);
        }
    });
}

module.exports = statFn;