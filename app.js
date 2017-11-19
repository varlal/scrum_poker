var http = require('http');
var socketio = require('socket.io');
var fs = require('fs');
var server = http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type' : 'text/html'});
    res.end(fs.readFileSync(__dirname + '/index.html', 'utf-8'));
}).listen(3000);  // ポート競合の場合は値を変更
 
var io = socketio.listen(server);
var cardList = {};

io.sockets.on('connection', function(socket) {
    socket.on('client_to_server', function(data) {
		if(data.value.indexOf("card") === 0){
			cardList[data.name] = data.value;
			if(data.value.indexOf("(Opened)") != -1){
				io.sockets.emit('server_to_client', {value : "open", cards:cardList});	
			}else{
        		io.sockets.emit('server_to_client', {value : cardList});
			}
		}else if(data.value.indexOf("delete") === 0){
			delete cardList[data.name];
			if(data.value.indexOf("(Opened)") != -1){
				io.sockets.emit('server_to_client', {value : "open", cards:cardList});	
			}else{
        		io.sockets.emit('server_to_client', {value : cardList});
			}
		}else if(data.value === "openbtn"){
        	io.sockets.emit('server_to_client', {value : "open", cards:cardList});
		}else if(data.value === "clearbtn"){
			cardList = {};
			io.sockets.emit('server_to_client', {value : "clear"});
		}
    });
});

