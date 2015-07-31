'use strict';

import _ from 'underscore';
import Backbone from 'backbone';
import Service from 'backbone.service';
import Radio from 'backbone.radio';
import MessageModel from 'lib/models/messageModel';
import UserCollection from 'lib/models/userCollection';
import UserModel from 'lib/models/userModel';
import KickView from 'lib/chat/kick';


const UserService = Service.extend({
  start(){
    this.myNick = "Guest"+ Math.floor(Math.random() * 1001);
    Radio.channel('users').on('receive',this._receive.bind(this));
    Radio.channel('users').on('join',this._join.bind(this));
    Radio.channel('users').on('part',this._part.bind(this));
    Radio.channel('users').on('quit',this._quit.bind(this));
    Radio.channel('users').on('disconnect',this._disconnect.bind(this));
    Radio.channel('users').on('mode',this._mode.bind(this));
    Radio.channel('users').on('whois',this._whois.bind(this));
    Radio.channel('users').on('op',this._op.bind(this));
    Radio.channel('users').on('deop',this._deop.bind(this));
    Radio.channel('users').on('voice',this._voice.bind(this));
    Radio.channel('users').on('devoice',this._devoice.bind(this));
    Radio.channel('users').on('kick',this._kick.bind(this));
    Radio.channel('users').on('kicked',this._kicked.bind(this));
    Radio.channel('users').on('ban',this._ban.bind(this));
    Radio.channel('users').on('nick',this._nick.bind(this));
    Radio.channel('users').on('changeMyNick',this._changeMyNick.bind(this));
    Radio.channel('users').reply('getMyNick', this.myNick);
    Radio.channel('users').reply('getChannelUsers', this._getUserCollection.bind(this));
    Radio.channel('users').reply('isUserInChannel', this._isUserInChannel.bind(this));
    Radio.channel('users').reply('getMyUserModelForChannel', this._getMyUserModelForChannel.bind(this));
  },
  _receive(messageModel){
    var service = this;
    var channelName = messageModel.get('channel');
    var userCollection = this._getUserCollection(channelName);
    var userArray = messageModel.get('content').split(' ');
    userArray.forEach(userStr=>{
      var userModel =  new UserModel({raw:userStr});
      userModel.parse();
      var currentUserModel = userCollection.get(userModel.get('nick'));
      if( !currentUserModel ){
        userCollection.add(userModel);  
      }else{
        currentUserModel.set(userModel.toJSON());
      }
    });
  },
  _join(messageModel){
    var channelName = messageModel.get('channel');
    var userCollection = this._getUserCollection(channelName);
    if( !userCollection.get(messageModel.get('nick')) ){
      var userModel =  new UserModel({nick:messageModel.get('nick')});
      userCollection.add(userModel);  
    }
  },
  _part(messageModel){
    var channelName = messageModel.get('channel');
    var userCollection = this._getUserCollection(channelName);
    var userModel = userCollection.get(messageModel.get('nick'));
    //reset the collection if you are leaving the channel
    if(messageModel.get('nick') == this.myNick){
      userCollection.reset();
    }else if(userModel){
      userCollection.remove(userModel);
    }
  },
  _quit(messageModel){
    _.each(this._channelUsers,(userCollection, channelName)=>{
      if(Radio.channel('users').request('isUserInChannel', channelName, messageModel.get('nick'))){
        var userModel = userCollection.get(messageModel.get('nick'));
        userCollection.remove(userModel);
      }
    });
  },
  _disconnect(messageModel){
    _.each(this._channelUsers, (collection, key, obj)=>{
      collection.reset();
      delete obj[key];
    });
  },
  _mode(messageModel){
    var channelName = messageModel.get('channel');
    if(this._hasUserCollection(channelName)){
      //is channel mode
      var userCollection = this._getUserCollection(channelName);
      var userModel = userCollection.get(messageModel.get('modeNick'));
      userModel.parseMode(messageModel.get('mode'))
    }else{
      //is user mode
    }
  },
  _nick(messageModel){
    _.each(this._channelUsers,(userCollection, channelName)=>{
      if(Radio.channel('users').request('isUserInChannel', channelName, messageModel.get('nick'))){
        var userModel = userCollection.get(messageModel.get('nick'));
        userModel.set('nick', messageModel.get('extra'));
      }
    });
    if( messageModel.get('extra') == this.myNick){
      Radio.channel('users').trigger('changeMyNick', messageModel.get('extra') );
    }
  },
  _changeMyNick(nick){
    this.myNick = nick;
    Radio.channel('users').reply('getMyNick', nick);
    var messageModel = new MessageModel({
      nick: nick,
      command: 'NICK'
    });
    Radio.channel('messages').trigger('send', messageModel);
  },
  _whois(userModel, channelModel){
    var messageModel = new MessageModel({
      extra: userModel.get('nick'),
      command: 'WHOIS'
    });
    Radio.channel('messages').trigger('send', messageModel);
  },
  _op(userModel, channelModel){
    var messageModel = new MessageModel({
      extra: '+o '+userModel.get('nick'),
      command: 'MODE',
      channel: channelModel.get('name'),
    });
    Radio.channel('messages').trigger('send', messageModel);
  },
  _deop(userModel, channelModel){
    var messageModel = new MessageModel({
      extra: '-o '+userModel.get('nick'),
      command: 'MODE',
      channel: channelModel.get('name'),
    });
    Radio.channel('messages').trigger('send', messageModel);
  },
  _voice(userModel, channelModel){
    var messageModel = new MessageModel({
      extra: '+v '+userModel.get('nick'),
      command: 'MODE',
      channel: channelModel.get('name'),
    });
    Radio.channel('messages').trigger('send', messageModel);
  },
  _devoice(userModel, channelModel){
    var messageModel = new MessageModel({
      extra: '-v '+userModel.get('nick'),
      command: 'MODE',
      channel: channelModel.get('name'),
    });
    Radio.channel('messages').trigger('send', messageModel);
  },
  _kick(userModel, channelModel){
    var messageModel = new MessageModel({
      extra: userModel.get('nick'),
      command: 'KICK',
      channel: channelModel.get('name')
    });
    var kickUser = function(data){
      messageModel.set('content', data.reason);
      Radio.channel('messages').trigger('send', messageModel);
    };
    Radio.channel('dialog').on('submit', kickUser);
    Radio.channel('dialog').once('close', ()=>{
      Radio.channel('dialog').off('submit', kickUser);  
    });
    Radio.channel('dialog').trigger('open', new KickView() );
  },
  _kicked(messageModel){
    var channelName = messageModel.get('channel');
    var userCollection = this._getUserCollection(channelName);
    var userModel = userCollection.get(messageModel.get('extra'));
    //reset the collection if you are leaving the channel
    if(messageModel.get('extra') == this.myNick){
      userCollection.reset();
    }else if(userModel){
      userCollection.remove(userModel);
    }
  },
  _ban(userModel, channelModel){
    /*
    var messageModel = new MessageModel({
      extra: userModel.get('nick'),
      command: 'KICK',
      channel: channelModel.get('name'),
    });
    var kickView = new KickView();
    Radio.channel('dialog').on('submit', function(data){
      messageModel.set('content', data.reason);
      Radio.channel('messages').trigger('send', messageModel);
    });
    Radio.channel('dialog').trigger('open', kickView);
    */
  },
  _getUserCollection(channelName){
    if(!this._hasUserCollection(channelName)){
      this._channelUsers[channelName] = new UserCollection();
    }
    return this._channelUsers[channelName];
  },
  _getMyUserModelForChannel(channelName){
    if(this._hasUserCollection(channelName)){
      return this._getUserModelForChannel(channelName, this.myNick);
    }else{
      return null;
    }
  },
  _getUserModelForChannel(channelName, nick){
    if(this._hasUserCollection(channelName)){
      return this._getUserCollection(channelName).get(nick);
    }else{
      return null;
    }
  },
  _isUserInChannel(channelName, nick){
    if(this._getUserModelForChannel(channelName, nick)){
      return true;
    }else{
      return false;
    }
  },
  _hasUserCollection(channelName){
    return Object.prototype.hasOwnProperty.call(this._channelUsers, channelName);
  },
  _channelUsers:{}
});

export default new UserService();
