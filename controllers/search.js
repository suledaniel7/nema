var orgSchema = require('./schemas/orgSchema');
var check = require('./spellcheckPrev');

function searchFn(req, res){
    var query = req.query.query;
    var nq = query.replace(/[^\sa-zA-Z]/g, '');
    var connective = 'in';
    var parameters = nq.split(' ');
    var params = new Array;
    parameters.forEach(element => {
        params.push(element);
    });
    for (let i = 0; i < parameters.length; i++) {
        const element = parameters[i];
        if(element === connective){
            var loc = params.splice(i+1, 1);
        }
    }
    function pluralise(word){
        var wLength = word.length;
        if(word.slice(wLength-3, wLength) !== 'ies' && word.slice(wLength-2, wLength) !== 'es' && word.slice(wLength-1, wLength) !== 's'){
            if(word[wLength - 1] === 'y'){
                var chars = word.split('');
                var charL = chars.length - 1;
                chars.splice(charL, 1, 'i', 'e', 's');
                var plurals = String(chars);
                var plural = plurals.replace(/,/g, '');
            }
            else if(word[wLength - 1] === 'o'){
                var chars = word.split('');
                chars.push('e', 's');
                var plurals = String(chars);
                var plural = plurals.replace(/,/g, '');
            }
            else {
                var chars = word.split('');
                chars.push('s');
                var plurals = String(chars);
                var plural = plurals.replace(/,/g, '');
            }
        }
        else {
            var plural = word;
        }
        
        return plural;
    }
    function singularise(word){
        var wLength = word.length;
        if(word.slice(wLength-3, wLength) === 'ies'){
            var wordArr = word.split('');
            var wALength = wordArr.length;
            wordArr.splice(wALength - 3, 3, 'y');
            var chars = String(wordArr);
            var singular = chars.replace(/,/g, '');
        }
        else if(word.slice(wLength-2, wLength) === 'es' && word.slice(wLength-3, wLength-2) === 'o'){
            var wordArr = word.split('');
            var wALength = wordArr.length;
            wordArr.splice(wALength - 2, 2, '');
            var chars = String(wordArr);
            var singular = chars.replace(/,/g, '');
        }
        else if (word.slice(wLength-1, wLength) === 's'){
            var wordArr = word.split('');
            var wALength = wordArr.length;
            wordArr.splice(wALength - 1, 1, '');
            var chars = String(wordArr);
            var singular = chars.replace(/,/g, '');
        }
        else {
            var singular = word;
        }
        return singular;
    }
    function searchDb(terms, location1){
        var results = new Array;
        var correctionObj = {
            correction: false,
            values: []
        }
        var lastEl = terms.length -1;
        // location1 = String(location1);
        // location1 = location1.toLowerCase();
        terms.forEach(iTerm => {
            var iTerm1 = '^' + iTerm + '$';
            var iTermS = singularise(iTerm);
            var iTerm2 = '^' + iTermS + '$';
            var iTermP = pluralise(iTerm);
            var iTerm3 = '^' + iTermP + '$';
            var term = RegExp(iTerm1.toLowerCase());
            var term1 = RegExp(iTerm2.toLowerCase());
            var term2 = RegExp(iTerm3.toLowerCase());
            if(location1.length < 2){
                var location = RegExp(location1);
            }
            orgSchema.find({fLocation: location, $or:[{fName: term}, {fName: term1}, {fName: term2}, {description: term}, {description: term1}, {description: term2}]}, function(err, org){
                if(err){
                    throw err;
                }
                else{
                    if(terms.indexOf(iTerm) !== lastEl) {
                        if(org.length !== 0){
                            for(var j=0; j<org.length; j++){
                                results.push(org[j]);
                            }
                        }
                        else {
                            var newTerm = check(iTerm);
                            if(newTerm.correction){
                                orgSchema.find({fLocation: location, $or:[{fName: newTerm.correction}, {description: newTerm.correction}]}, function(err, newOrg){
                                    if(err){
                                        throw err;
                                    }
                                    else {
                                        if(newOrg.length !== 0){
                                            for(var k=0; k<newOrg.length; k++){
                                                results.push(newOrg[k]);
                                            }
                                            correctionObj.correction = true;
                                            correctionObj.values.push({
                                                initial: iTerm,
                                                corrected: newTerm.correction
                                            });
                                        }
                                    }
                                });
                            }
                        }
                    }
                    else {
                        if(org.length !== 0){
                            for(var j=0; j<org.length; j++){
                                results.push(org[j]);
                            }
                            results.forEach(result => {
                                var i = results.indexOf(result) +1;
                                for(i; i<results.length; i++){
                                    if(results[i].username === result.username){
                                        results.splice(i, 1);
                                    }
                                }
                            });
                            var orgObj = {
                                organisations: results,
                                query: query
                            }
                            if(results.length === 0){
                                res.render('search', {
                                    noResults: "No results found for search term, consider using more concise terms",
                                    query: query
                                });
                            }
                            else {
                                if(!correctionObj.correction){
                                    res.render('search', orgObj);
                                }
                                else {
                                    orgObj.corrections = correctionObj.values;
                                    res.render('search', orgObj);
                                }
                            }
                        }
                        else {
                            var newTerm = check(iTerm);
                            if(newTerm.correction){
                                orgSchema.find({fLocation: location, $or:[{fName: newTerm.correction}, {description: newTerm.correction}]}, function(err, newOrg){
                                    if(err){
                                        throw err;
                                    }
                                    else {
                                        if(newOrg.length !== 0){
                                            for(var k=0; k<newOrg.length; k++){
                                                results.push(newOrg[k]);
                                            }
                                            correctionObj.correction = true;
                                            correctionObj.values.push({
                                                initial: iTerm,
                                                corrected: newTerm.correction
                                            });
                                        }
                                        
                                        results.forEach(result => {
                                            var i = results.indexOf(result) +1;
                                            for(i; i<results.length; i++){
                                                if(results[i].username === result.username){
                                                    results.splice(i, 1);
                                                }
                                            }
                                        });
                                        var orgObj = {
                                            organisations: results,
                                            query: query
                                        }
                                        
                                        if(results.length === 0){
                                            res.render('search', {
                                                noResults: "No results found for search term, consider using more concise terms",
                                                query: query
                                            });
                                        }
                                        else {
                                            if(!correctionObj.correction){
                                                res.render('search', orgObj);
                                            }
                                            else {
                                                orgObj.corrections = correctionObj.values;
                                                res.render('search', orgObj);
                                            }
                                        }
                                    }
                                });
                            }
                            else {
                                results.forEach(result => {
                                    var i = results.indexOf(result) +1;
                                    for(i; i<results.length; i++){
                                        if(results[i].username === result.username){
                                            results.splice(i, 1);
                                        }
                                    }
                                });
                                var orgObj = {
                                    organisations: results,
                                    query: query
                                }
                                if(results.length === 0){
                                    res.render('search', {
                                        noResults: "No results found for search term, consider using more concise terms",
                                        query: query
                                    });
                                }
                                else {
                                    if(!correctionObj.correction){
                                        res.render('search', orgObj);
                                    }
                                    else {
                                        orgObj.corrections = correctionObj.values;
                                        res.render('search', orgObj);
                                    }
                                }
                            }
                        }
                    }
                }
            });
        });
    }
    
    if(!loc){
        searchDb(params, '.');
    }
    else {
        searchDb(params, loc);
    }
}

module.exports = searchFn;