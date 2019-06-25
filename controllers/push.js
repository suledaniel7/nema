var orgSchema = require('./schemas/orgSchema');
var notifsSchema = require('./schemas/notifsSchema');

var pushFn = function(req, res){
    var d = new Date(),
        day = d.getDay(),
        date = d.getDate(),
        month = d.getMonth(),
        year = d.getFullYear(),
        second = d.getSeconds(),
        millisecond = d.getMilliseconds(),
        minute = d.getMinutes(),
        hour = d.getHours();

    var uid = String(date)+String(month)+String(year)+String(hour)+String(minute)+String(second)+String(millisecond);
    
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

    var orgName = req.orgsession.user.username;
    var fullName = req.orgsession.user.name;
    var text = req.body.push;

    var newest = new notifsSchema({
        orgName: orgName,
        fullName: fullName,
        text: text,
        date: theDate,
        time: theTime,
        uid: uid
    });

    newest.save(function(err){
        if(err) {
            var user1 = req.orgsession.user;
            user1.error = 'Error pushing notification. Please try again.'
            res.render('orgProfile', user1);
        }
        else {
            res.redirect('/organisation/profile');
        }
    });
}

module.exports = pushFn;