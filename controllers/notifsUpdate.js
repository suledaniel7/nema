var notifsSchema = require('./schemas/notifsSchema');

function notifUpdateFn (req, res){
    var uid = req.params[0];
    var text = req.body.notification;
    notifsSchema.findOneAndUpdate({uid: uid}, {text: text}, function(err){
        if(err) {
            res.redirect('/edit/notifications/'+uid);
        }
        else {
            res.redirect('/organisation/profile');
        }
    });
}

module.exports = notifUpdateFn;