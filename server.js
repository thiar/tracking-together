var http = require('http');
var Static = require('node-static');
var app = http.createServer(handler);
var io = require('socket.io').listen(app);
var port = 8001;

var files = new Static.Server('./public');
var user={}
function handler (request, response) {
	request.on('end', function() {
		files.serve(request, response);
	}).resume();
}

// delete to see more logs from sockets
io.set('log level', 1);

io.sockets.on('connection', function (socket) {

	// socket.on('send:coords', function (data) {
	// 	socket.broadcast.emit('load:coords', data);
	// 	console.log(data)
	// });
	
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
app.listen(port);
console.log('Your server goes on localhost:' + port);

