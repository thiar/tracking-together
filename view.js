

var port = 4444;
// var mongoose = require('mongoose');
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


app.get("/test", function(req,res){
	res.render('page', {layout: 'layoutnew',page: req.url})
})

//app.get("/test", function(req,res){
//	res.render('test')
//})


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
		// for(var i in user)
		// {
		// 	if(user[i].socketid==socket.id)
		// 	{
		// 		var dataR={}
		// 		dataR.id=user[i].id
		// 		delete user[i];
		// 		io.emit('connection:remove',dataR)
		// 	}
		// }
		var dataR={}
		dataR.id=user[data.id].id
		delete user[data.id];
		io.emit('connection:remove',dataR)

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
				console.log(socket.handshake.address+" disconnect")
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
	//socket.emit('connection:clear',user);
	user ={}

}
http.listen(port, function(){
  console.log('listening on *:'+port);
});
// /*database connection*/
// mongoose.connect('mongodb://localhost/test');
// /*collection user shcema*/
// var userSchema = mongoose.Schema({
//     username: String,
//     password: String,
//     friends: {}
// })
// /* method add friend*/
// userSchema.statics.addFriend=function(id,friendId){
// 	this.model('User').findOneAndUpdate(
// 	    {_id: id},
// 	    {$push: {friends: friendId}},
// 	    {safe: true, upsert: true},
// 	    function(err, model) {
// 	        console.log(err);
// 	    }
// 	);
// }

// /* user model*/
// var User = mongoose.model('User', userSchema)


// app.post('/register',function(req,res){
// 	var username=req.body.username
// 	var password=req.body.password
// 	var newUser = new User({ username:username,password:password});
// 	User.find({username:username},'username',function(err,result){
//         if (err)
//             console.log('error occured in the database');
//         if(result.length=== 0){
//         	newUser.save(function(err){
// 				res.end("registrasi berhasil")
// 			})
//         }
//         else {
//         	res.end("duplicate entry")
//         	console.log(result.length)
//         }
//     }).limit(1);
<<<<<<< HEAD
// })
=======
// })
>>>>>>> 5485938bf827f1d2d8cda174a12e3a2c23b8ee63
