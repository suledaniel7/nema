var notifsSchema = require('./schemas/notifsSchema');

function notifsFn(req, res) {
    var uid = req.params[0];
    notifsSchema.findOne({uid: uid}, function(err, notif){
        if(err){
            res.redirect('/organisation/profile');
        }
        else {
            res.render('notifsEdit', notif);
        }
    });
}

module.exports = notifsFn;