'use strict';

//import io from 'javascripts/socket.io';
import _ from 'underscore';
import Radio from 'backbone.radio';
import MessageModel from 'lib/models/messageModel.js';


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
        Radio.channel('socket').trigger('disconnected');
    });

    socket.addEventListener('message', function(event) {
        var messageModel = new MessageModel({raw:event.data});
        var message = messageModel.parse();
        Radio.channel('messages').trigger('receive', messageModel);
console.log('message command: '+messageModel.get('command'));
console.log(message);
console.log(event.data);
    });
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