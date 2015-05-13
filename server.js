

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
		//console.log(data)
	})
	socket.on('send:location',function(data){
		//console.log(data)
		if (!(data.id in user)) {
			//console.log(data)
			//data.id=socket.handshake.address;
			user[data.id] = data;
		}
		io.emit('load:coords', data);
		socket.emit('connection:list',user);
		console.log(socket.handshake.address)
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
			}
		}
	});
	socket.on('connection:update', function (data) {
		user[data.id] = data;
		io.emit('connection:updatelocation',data)
		
	});
	socket.on('disconnect', function (data) {
		for(var i in user)
		{
			
			if(user[i].socketid==socket.id)
			{
				var dataR={}
				dataR.id=user[i].id
				delete user[i];
				io.emit('connection:remove',dataR)
				console.log("disconnect")
			}
		}
		
	});

	setInterval(function() {
	    clearUser(user,io)
	    for (var i = 0; i < 1; i++) {
	    }
	}, 10000)

});


function clearUser(user,socket)
{
	socket.emit('connection:clear',user);
	user ={}

}
http.listen(port, function(){
  console.log('listening on *:'+port);
});
