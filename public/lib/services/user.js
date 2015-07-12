'use strict';

import Service from 'backbone.service';
import Backbone from 'backbone';
import Radio from 'backbone.radio';
import MessageModel from 'lib/models/messageModel';


const UserService = Service.extend({
  //channelName: 'users',
  start(){
    this.nick = "Guest_"+ Math.floor(Math.random() * 1001);
    Radio.channel('users').on('changeNick',this._changeNick.bind(this));
    Radio.channel('users').reply('getNick', this.nick);
  },
  _changeNick(nick){
    this.nick = nick;
    Radio.channel('users').reply('getNick', nick);
    var messageModel = new MessageModel({
      nick: nick,
      command: 'NICK'
    });
    Radio.channel('messages').trigger('send', messageModel);
  },
  _channelUsers:{}
});

export default new UserService();