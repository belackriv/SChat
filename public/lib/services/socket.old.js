'use strict';

import io from 'javascripts/socket.io';
import Radio from 'backbone.radio';



var socket = null;
var socketChannel = Radio.channel('socket');

socketChannel.on('connect', function(){
  socket = io.connect();
  socket.io.reconnection(true);
  socket.on('message', function (message) {
    Radio.channel('messages').trigger('receive',message);
    console.log(message);
  });
  socket.on('connect', function () {
    console.log('connected');
    socket.emit('ircconnect', 'Tamah');
    socketChannel.trigger('connected');
  });
  socket.on('error', function (err) {
    console.log('socket error: '+err);
    socketChannel.trigger('error', err);
  });
  socket.on('reconnecting', function (count) {
    console.log('reconnecting attempt #'+count);
    socketChannel.trigger('reconnecting');
  });
  socket.on('reconnect', function (count) {
    console.log('reconnected on attempt #'+count);
    socketChannel.trigger('reconnected');
  });
  socket.on('disconnect', function () {
    console.log('disconnected');
    socketChannel.trigger('disconnected');
  });
});

socketChannel.on('disconnect', function(){
  if(socket){
    socket.io.reconnection(false);
    socket.emit('disconnect');
    socket.disconnect();
  }
});
	
socketChannel.on('emit', function(message){
  if(socket){
    socket.emit('message', message);
  }
});