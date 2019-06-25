var orgSchema = require('./schemas/orgSchema');

var searchFn = function(req, res){
    var parameter = req.query.query;

    var parameters = parameter.split(" ");
    var orgArray = new Array();
    var number = parameters.length;
    
    parameters.forEach(function(element) {
        var element1 = RegExp(element.toLowerCase());
        orgSchema.find({$or:[{description: element1}, {fName: element1}, {flocation: element1}]}, function(err, org){
            if(err) throw err;
            else {
                orgArray.push(org);
                if (parameters.indexOf(element) === number-1){
                    if(orgArray[0].length === 0){
                        res.render('search', {noResults: "No results found for search term, consider using more concise terms"});
                    }
                    else {
                        var first = orgArray[0];
                        var organisations = {
                            organisations: first,
                            query: parameter
                        }
                        res.render('search', organisations);
                    }
                    
                }
            }
            
        });
        
    }, this);

    
}

module.exports = searchFn;