var reviewSchema = require('./schemas/reviewSchema');
var orgSchema = require('./schemas/orgSchema');

var reviewFn = function(req, res){
    var username = req.session.user.username;
    var name = req.session.user.fName + " " + req.session.user.lName;
    var text = req.body.review;
    var org = req.params[0];

    orgSchema.findOne({username: org}, function(err, organisation){
        var d = new Date(),
            day = d.getDay(),
            date = d.getDate(),
            month = d.getMonth(),
            year = d.getFullYear(),
            millisecond = d.getMilliseconds(),
            second = d.getSeconds(),
            minute = d.getMinutes(),
            hour = d.getHours();

        var uid = String(date)+String(month)+String(year)+String(hour)+String(minute)+String(second)+String(millisecond);
        var organisationName = organisation.name;

        var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", 'Nov', "Dec"],
            days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        if (hour > 12) {
            var realTime = hour - 12 + ":" + minute + "PM";
        }
        else if (minute < 10) {
            var realTime = hour + ":0" + minute + "AM";
        }
        else {
            var realTime = hour + ":" + minute + "AM";
        }
        var realDay = days[day],
            realMonth = months[month],
            realDate = realDay + ", " + realMonth + " " + date + ", " + year;

        var theDate = date +" " + realMonth + " " + year;
        var theTime = realTime;

        var newReview = new reviewSchema({
            username: username,
            name: name,
            orgName: org,
            review: text,
            organisation: organisationName,
            date: theDate,
            time: theTime,
            uid: uid
        });

        newReview.save(function(err){
            if(err) throw err;
            else {
                res.redirect('/user/'+org);
            }
        });
    });
    
}

module.exports = reviewFn;