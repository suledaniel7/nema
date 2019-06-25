var express = require('express');
var mongoose = require('mongoose');
var router = require('./server/router');
var organisation = require('./server/organisation');
var user = require('./server/user');
var stats = require('./server/stats');
var edit = require('./server/edit');
var del = require('./server/delete');
var exphbs = require('express-handlebars');

mongoose.connect('mongodb://127.0.0.1/nema');
var app = express();

app.use('/', router);
app.use('/organisation', organisation);
app.use('/user', user);
app.use('/statistics', stats);
app.use('/edit', edit);
app.use('/delete', del);
app.use(express.static('public'));
app.engine('.hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');

app.listen(8089);
console.log("Server listening at http://127.0.0.1:8089");