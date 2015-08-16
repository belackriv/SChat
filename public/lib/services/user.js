'use strict';

import _ from 'underscore';
import Backbone from 'backbone';
import Service from 'backbone.service';
import Radio from 'backbone.radio';
import MessageModel from 'lib/models/messageModel';
import ModeModel from 'lib/models/modeModel';
import UserCollection from 'lib/models/userCollection';
import UserModel from 'lib/models/userModel';
import KickView from 'lib/chat/kick';


const UserService = Service.extend({
  start(){
    this.myNick = 'Guest'+ Math.floor(Math.random() * 1001);
    Radio.channel('users').on('receive',this._receive.bind(this));
    Radio.channel('users').on('join',this._join.bind(this));
    Radio.channel('users').on('part',this._part.bind(this));
    Radio.channel('users').on('quit',this._quit.bind(this));
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
    Radio.channel('users').on('away',this._away.bind(this));
    Radio.channel('users').on('who',this._who.bind(this));
    Radio.channel('users').on('changeMyNick',this._changeMyNick.bind(this));
    Radio.channel('users').reply('getMyNick', this.myNick);
    Radio.channel('users').reply('getChannelUsers', this._getUserCollection.bind(this));
    Radio.channel('users').reply('isUserInChannel', this._isUserInChannel.bind(this));
    Radio.channel('users').reply('isBanPending', this._isBanPending.bind(this));
    Radio.channel('users').reply('getMyUserModelForChannel', this._getMyUserModelForChannel.bind(this));
    Radio.channel('socket').on('connected',this._connected.bind(this));
    Radio.channel('socket').on('disconnected',this._disconnected.bind(this));

  },
  _connected(){
    this._intervalId = setInterval(this._refreshUsers.bind(this), 30000);
  },
  _refreshUsers(){
    for(let channelName in this._channelUsers){
      if(channelName !== 'server'){
        var messageModel = new MessageModel({
          command: 'WHO',
          channel: channelName
        });
        Radio.channel('messages').trigger('send', messageModel);
      }
    }
  },
  _disconnected(){
    _.each(this._channelUsers, (collection, key, obj)=>{
      collection.reset();
      delete obj[key];
    });
    clearInterval(this._intervalId);
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
      var userModel =  new UserModel();
      userModel.parse(messageModel);
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
  _mode(messageModel){
    var channelName = messageModel.get('channel');
    for(let modeModel of messageModel.get('modes')){
      if(modeModel.get('scopes').indexOf('userFlag') > -1){
        _.each(this._channelUsers, (userCollection)=>{
          var userModel = userCollection.get(messageModel.get('nick'));
          if(userModel){
            userModel.parseMode(modeModel);
          }
        });
      }else if(modeModel.get('scopes').indexOf('channelFlag') > -1){
        if(this._hasUserCollection(channelName)){
          var userCollection = this._getUserCollection(channelName);
          var userModel = userCollection.get(modeModel.get('param'));
          if(userModel){
            userModel.parseMode(modeModel);
          }
        }
      }
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
  _away(messageModel){
    _.each(this._channelUsers,(userCollection, channelName)=>{
      if(Radio.channel('users').request('isUserInChannel', channelName, messageModel.get('nick'))){
        var userModel = userCollection.get(messageModel.get('nick'));
        userModel.set('isAway', true);
      }
    });
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
  _whois(channelModel, userModel){
    var messageModel = new MessageModel({
      extra: userModel.get('nick'),
      command: 'WHOIS'
    });
    Radio.channel('messages').trigger('send', messageModel);
  },
  _op(channelModel, userModel){
    var modeModel = new ModeModel({
      flag: 'o',
      isSet: true,
      param: userModel.get('nick'),
      paramName: 'nick',
      isParamAlwaysRequired: true
    });
    var messageModel = new MessageModel({
      modes: [modeModel],
      command: 'MODE',
      channel: channelModel.get('name'),
    });
    Radio.channel('messages').trigger('send', messageModel);
  },
  _deop(channelModel, userModel){
    var modeModel = new ModeModel({
      flag: 'o',
      isSet: false,
      param: userModel.get('nick'),
      paramName: 'nick',
      isParamAlwaysRequired: true
    });
    var messageModel = new MessageModel({
      modes: [modeModel],
      command: 'MODE',
      channel: channelModel.get('name'),
    });
    Radio.channel('messages').trigger('send', messageModel);
  },
  _voice(channelModel, userModel){
    var modeModel = new ModeModel({
      flag: 'v',
      isSet: true,
      param: userModel.get('nick'),
      paramName: 'nick',
      isParamAlwaysRequired: true
    });
    var messageModel = new MessageModel({
      modes: [modeModel],
      command: 'MODE',
      channel: channelModel.get('name'),
    });
    Radio.channel('messages').trigger('send', messageModel);
  },
  _devoice(channelModel, userModel){
    var modeModel = new ModeModel({
      flag: 'v',
      isSet: false,
      param: userModel.get('nick'),
      paramName: 'nick',
      isParamAlwaysRequired: true
    });
    var messageModel = new MessageModel({
      modes: [modeModel],
      command: 'MODE',
      channel: channelModel.get('name'),
    });
    Radio.channel('messages').trigger('send', messageModel);
  },
  _kick(channelModel, userModel){
    var messageModel = new MessageModel({
      extra: userModel.get('nick'),
      command: 'KICK',
      channel: channelModel.get('name')
    });
    var kickUser = (data)=>{
      messageModel.set('content', data.reason);
      Radio.channel('messages').trigger('send', messageModel);
    };
    Radio.channel('dialog').on('submit', kickUser);
    Radio.channel('dialog').once('close', ()=>{
      Radio.channel('dialog').off('submit', kickUser);
    });
    Radio.channel('dialog').trigger('open', new KickView() );
  },
  _ban(channelModel, userModel){
    userModel.set('isBanPending', true);
    userModel.set('banPendingChannelModel', channelModel);
    this._setUserPendingBan(userModel);
    this._whois(channelModel, userModel);
  },
  _isBanPending(messageModel){
    var whoIsUserModel = new UserModel();
    whoIsUserModel.parse(messageModel);
    var userModel = this._getUserPendingBan(whoIsUserModel.get('nick'));
    if(userModel && userModel.get('isBanPending')){
      userModel.parse(messageModel);
      var banMask = '*@'+userModel.get('host');
      var channelModel = userModel.get('banPendingChannelModel');
      Radio.channel('channels').trigger('ban:add', channelModel, banMask );
      this._kick(channelModel, userModel);
      userModel.unset('isBanPending');
      userModel.unset('banPendingChannelModel');
      this._unsetUserPendingBan(userModel);
      return true;
    }else{
      return false;
    }
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
  _who(messageModel){
    if(messageModel.get('channel') !== '*'){
      if(messageModel.get('userMode').indexOf('H') > -1){
        this._getUserModelForChannel(messageModel.get('channel'), messageModel.get('nick')).set('isAway', false);
      }else{
        this._getUserModelForChannel(messageModel.get('channel'), messageModel.get('nick')).set('isAway', true);
      }
    }
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
  _getUserPendingBan(nick){
    return this._pendingBansUsers[nick];
  },
  _setUserPendingBan(userModel){
    this._pendingBansUsers[userModel.get('nick')] = userModel;
  },
  _unsetUserPendingBan(userModel){
    delete this._pendingBansUsers[userModel.get('nick')];
  },
  _channelUsers:{},
  _pendingBansUsers:{}
});

export default new UserService();
