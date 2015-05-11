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
			user[data.id] = data;
		}
		console.log(user)
		io.emit('load:coords', data);
		socket.emit('connection:list',user);
	})
	socket.on('connection:close', function (data) {
		delete user[data.id];
		io.emit('connection:remove',data)
		console.log(user)
	});
	socket.on('connection:update', function (data) {
		
		//io.emit('connection:remove',data)
		console.log("update "+data.id)
	});
	socket.on('disconnect', function (data) {
		delete user[data.id];
		io.emit('connection:remove',data)
		console.log(user)
	});

});

// start app on specified port
app.listen(port);
console.log('Your server goes on localhost:' + port);