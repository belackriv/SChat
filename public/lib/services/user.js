'use strict';

import Service from 'backbone.service';
import Backbone from 'backbone';
import Radio from 'backbone.radio';
import MessageModel from 'lib/models/messageModel';
import UserCollection from 'lib/models/userCollection';
import UserModel from 'lib/models/userModel';


const UserService = Service.extend({
  //channelName: 'users',
  start(){
    this.nick = "Guest_"+ Math.floor(Math.random() * 1001);
    Radio.channel('users').on('changeNick',this._changeNick.bind(this));
    Radio.channel('users').on('receive',this._receive.bind(this));
    Radio.channel('users').reply('getNick', this.nick);
    Radio.channel('users').reply('getChannelUsers', this._getUserCollection.bind(this));
  },
  _receive(messageModel){
    if(!this._getUserCollection(messageModel.get('channel'))){
      this._channelUsers[messageModel.get('channel')] = new UserCollection();
    }
    var userArray = messageModel.get('content').split(' ');
    userArray.forEach(userStr=>{
      var userModel =  new UserModel({raw:userStr});
      userModel.parse();
      this._channelUsers[messageModel.get('channel')].add(userModel);
    });
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
  _getUserCollection(channelName){
    if(typeof channelName === 'string'){
      if(!this._channelUsers[channelName.toLowerCase()]){
        this._channelUsers[channelName.toLowerCase()] = new UserCollection();
      }
      return this._channelUsers[channelName.toLowerCase()];
    }else{
      return null;
    }
  },
  _channelUsers:{}
});

export default new UserService();