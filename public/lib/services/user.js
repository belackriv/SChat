'use strict';

import Service from 'backbone.service';
import Backbone from 'backbone';
import Radio from 'backbone.radio';
import MessageModel from 'lib/models/messageModel';
import UserCollection from 'lib/models/userCollection';
import UserModel from 'lib/models/userModel';


const UserService = Service.extend({
  start(){
    this.nick = "Guest_"+ Math.floor(Math.random() * 1001);
    Radio.channel('users').on('receive',this._receive.bind(this));
    Radio.channel('users').on('join',this._join.bind(this));
    Radio.channel('users').on('part',this._part.bind(this));
    Radio.channel('users').on('changeNick',this._changeNick.bind(this));
    Radio.channel('users').on('whois',this._whois.bind(this));
    Radio.channel('users').reply('getNick', this.nick);
    Radio.channel('users').reply('getChannelUsers', this._getUserCollection.bind(this));
  },
  _receive(messageModel){
    var channelName = messageModel.get('channel');
    var userCollection = this._getUserCollection(channelName);
    var userArray = messageModel.get('content').split(' ');
    userArray.forEach(userStr=>{
      var userModel =  new UserModel({raw:userStr});
      userModel.parse();
      if(! userCollection.get(userModel.get('nick')) ){
        userCollection.add(userModel);  
      }
    });
  },
  _join(messageModel){
    var channelName = messageModel.get('channel');
    var userCollection = this._getUserCollection(channelName);
    var userModel =  new UserModel({nick:messageModel.get('nick')});
    if(! userCollection.get(messageModel.get('nick')) ){
      userCollection.add(userModel);  
    }
  },
  _part(messageModel){
    var channelName = messageModel.get('channel');
    var userCollection = this._getUserCollection(channelName);
    var userModel = userCollection.get(messageModel.get('nick'));
    if(userModel){
      userCollection.remove(userModel);
    }
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
  _whois(nick){
    var messageModel = new MessageModel({
      extra: nick,
      command: 'WHOIS'
    });
    Radio.channel('messages').trigger('send', messageModel);
  },
  _getUserCollection(channelName){
    if(!Object.prototype.hasOwnProperty.call(this._channelUsers, channelName)){
      this._channelUsers[channelName] = new UserCollection();
    }
    return this._channelUsers[channelName];
  },
  _channelUsers:{}
});

export default new UserService();
