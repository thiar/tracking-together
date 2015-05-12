

var port = 4444;

var express = require('express');
var app = express();
var session = require('express-session');
expressLayouts = require('express-ejs-layouts');
var bodyParser = require("body-parser");
var http = require('http').Server(app);
var io = require('socket.io').listen(http);
var mysql = require('mysql');
var partial = require('express-partial');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded());
app.use(partial())
app.use(expressLayouts)
app.set('view engine', 'ejs')
app.set('layout', 'layout')

// var files = new Static.Server('./public');

// function handler (request, response) {
// 	request.on('end', function() {
// 		files.serve(request, response);
// 	}).resume();
// }
var user={}
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))

app.get("/home",function(req,res){
	res.render('home', { layout: 'layout',page: req.url })
})

app.get("/map",function(req,res){
	res.render('map', { layout: 'layout',page: req.url })
})

app.get("/", function(req,res){
	res.redirect('/map')
})

io.sockets.on('connection', function (socket) {

	socket.on('log',function(data){
		console.log(data)
	})
	socket.on('send:location',function(data){
		//console.log(data)
		if (!(data.id in user)) {
			console.log(data)
			user[data.id] = data;
		}
		io.emit('load:coords', data);
		socket.emit('connection:list',user);
		console.log(user)
	})
	socket.on('connection:close', function (data) {
	
		for(var i in user)
		{
			
			if(user[i].socketid==socket.id)
			{
				var dataR={}
				dataR.id=user[i].id
				delete user[i];
				io.emit('connection:remove',dataR)
				//console.log("connection close")
			}
		}
		//console.log("real "+socket.id)
		
	});
	socket.on('connection:update', function (data) {
		user[data.id] = data;
		io.emit('connection:updatelocation',data)
		//console.log("update "+data.id)
	});
	socket.on('disconnect', function (data) {
		for(var i in user)
		{
			//console.log("i= "+i+"socket= "+user[i].socketid)
			if(user[i].socketid==socket.id)
			{
				var dataR={}
				dataR.id=user[i].id
				delete user[i];
				io.emit('connection:remove',dataR)
				console.log("disconnect")
			}
		}
		//console.log("real "+socket.id)
	});

});

// start app on specified port
// app.listen(port);
// console.log('Your server goes on localhost:' + port);
http.listen(port, function(){
  console.log('listening on *:'+port);
});
