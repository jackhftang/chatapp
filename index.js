var Hapi = require('hapi');
var SocketIO = require('socket.io');

// helpers
var log = console.log.bind(console);

// setup web server
var server = new Hapi.Server();
server.connection({
  port: 8080
});

// attach socket.io to web server
var io = SocketIO(server.listener);

// setup routes
server.route({
  method: 'GET',
  path: '/',
  handler: function(req, rep){
    rep.file('index.html');
  }
});

// socket handler
var history = [];
io.on('connection', function(socket){
  log('new connection');

  socket.emit('msg', history);

  socket.on('msg', function(msg){
    log(msg);
    history.push(msg);
    while(history.length > 5) history.shift();
    io.emit('msg', msg);
  });

});


server.start(function(){
  log('listening', server.info.uri);
});
