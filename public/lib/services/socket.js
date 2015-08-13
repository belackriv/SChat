'use strict';

//import io from 'javascripts/socket.io';
import _ from 'underscore';
import Radio from 'backbone.radio';
import MessageModel from 'lib/models/messageModel';


var socket = null;
var socketChannel = Radio.channel('socket');


socketChannel.on('connect', function(options){
  options = _.extend({
    user: 'SChatWebUser',
    nick: options.nick,
    server: options.server
  }, options);

  if (window['WebSocket']) {
    socket = new WebSocket(options.server);
    
    socket.addEventListener('open', function(event) {
      var userReply = new MessageModel({command: 'USER', extra: options.user+' user dazed.ef.net :WebChat User'});
      socketChannel.trigger('send',userReply);
      var nickReply = new MessageModel({command: 'NICK', nick: options.nick});
      socketChannel.trigger('send',nickReply);
    });

    socket.addEventListener('close', function(event) {
        Radio.channel('channels').trigger('disconnect');
    });

    socket.addEventListener('message', function(event) {
        var messageModel = new MessageModel({raw:event.data});
        var message = messageModel.parse();
        
        Radio.channel('messages').trigger('receive', messageModel);

console.log('message command: '+messageModel.get('command'));
console.log(message);
console.log(event.data);
    });

    Radio.channel('navbar').trigger('connected');
  } else {
      //show 'No socket' invalid message
  }
});

socketChannel.on('disconnect', function(){
  if(socket && socket.readyState == socket.OPEN){
    socket.close();
  }
});
	
socketChannel.on('send', function(messageModel){
  if(socket && socket.readyState == socket.OPEN){
    socket.send(messageModel.toString());
  }
});