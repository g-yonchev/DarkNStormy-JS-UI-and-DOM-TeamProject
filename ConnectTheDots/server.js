var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = 3000;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

app.use(express.static(__dirname + '/public'));

io.on('connection', function(socket){
  socket.on('id',function(id) {
    //console.log('id: ' + id);
    io.emit('id',id);
  });


  socket.on('rect color',function(color) {
    //console.log('color: ' + color);
    io.emit('rect color',color);
  });

  socket.on('difficulty', function (diff) {
      //console.log(diff);
      io.emit('difficulty', diff);
  });

  socket.on('set up game', function () {
      io.emit('set up game', null);
  });

  socket.on('player turn', function (turn) {
      io.emit('player turn', turn);
  });
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});
