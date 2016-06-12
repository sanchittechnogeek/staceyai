var http = require('http');
var	express = require('express');
var im_server = require('./assets/im_server');

//making all the files in public folder accessible
var app = express();
app.use(app.router);
app.use(express.static(__dirname + '/public'));

//creating express server at localhost:2000
var server = http.createServer(app).listen('2000', '127.0.0.1'); 
im_server.listen(server);

//serving static landing page file
app.get('/', function(req, res){
	res.sendfile(__dirname + '/views/index.html');
});

//web app root file
app.get('/app', function(req, res){
	res.sendfile(__dirname + '/views/app.html');
});

//bot integration
app.get('/bot', function(req, res){
	res.sendfile(__dirname + '/views/bot.html');
});