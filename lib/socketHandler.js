var handler = {};
var util = require('util');
var irc = require('irc');

handler.connect = function(socket){
  var client = null;
  socket.on('ircconnect', function (nick) {
    client = new irc.Client('irc.gamesurge.net', 'TamahWebRelay',{autoConnect: false});
    client.addListener('raw', function (message) {
      socket.emit('message',message);
      console.log('message: '+util.inspect(message));
    });
    client.addListener('error', function(message) {
      console.log('error: ', message);
    });
    client.connect(function(){
      client.join('#tamahwebrelaytest');
      console.log('connected to irc as '+nick);
    });
  });
	socket.on('message', function (message) {
	  console.log(message);
	});
  socket.on('disconnect', function(){
    client.disconnect();
  })
};

module.exports = handler;