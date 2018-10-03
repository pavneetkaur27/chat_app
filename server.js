var express=require('express');
var app=express();
var path=require('path');
var server=require('http').createServer(app);
var io=require('socket.io').listen(server);
var usernames=[];

app.use(express.static(path.join(__dirname, 'public')));

app.get('/',function(req,res){
	  	res.status(300).sendFile(path.join(__dirname,"index.html"));
});

io.on('connection',function(socket){
	console.log("User connected");

	socket.on('new user',function(data,callback){
		console.log(data);
		if(usernames.indexOf(data)!= -1){
			callback(false);
		}else{
			callback(true);
			socket.username=data;
			usernames.push(socket.username);
			updateUsername();
		}
	});


	function updateUsername(){
		io.sockets.emit('usernames',usernames);
	};

	socket.on('send message', function(data){
		io.sockets.emit('new message', {msg: data, username:socket.username});
	});

	socket.on('disconnect',function(data){
		if(!socket.username){
			return;
		}
		usernames.splice(usernames.indexOf(socket.username),1);
		updateUsername();
	});

});

server.listen(process.env.PORT || 3000);