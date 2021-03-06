'use strict';

import _ from 'underscore';
import Backbone from 'backbone';
import Service from 'backbone.service';
import Radio from 'backbone.radio';
import MessageModel from 'lib/models/messageModel.js';
import ChannelCollection from 'lib/models/channelCollection.js';
import ChannelModel from 'lib/models/channelModel.js';
import ChannelInfoView from 'lib/chat/channelInfo.js';
import ModeModel from 'lib/models/modeModel.js';
import modes from 'lib/models/modes.js';
import BanMaskModel from 'lib/models/banMaskModel.js';
import ChannelKeyView from 'lib/chat/channelKey.js';

const ChannelService = Service.extend({
  setup(options = {}) {
    this.collection = new ChannelCollection();
    this.server = 'ws://dazed.ef.net:8080/ws';
    //this.server = "ws://localhost:8080";
  },
  start(){
    Radio.channel('socket').on('connected',this._connected.bind(this));
    Radio.channel('socket').on('disconnected',this._disconnected.bind(this));
    Radio.channel('channels').on('change:topic',this._changedTopic.bind(this));
    Radio.channel('channels').on('activate',this._activateChannel.bind(this));
    Radio.channel('channels').on('join',this._joinChannel.bind(this));
    Radio.channel('channels').on('key:invalid',this._invalidChannelKey.bind(this));
    Radio.channel('channels').on('part',this._partChannel.bind(this));
    Radio.channel('channels').on('kicked',this._kicked.bind(this));
    Radio.channel('channels').on('bans',this._bans.bind(this));
    Radio.channel('channels').on('ban:add',this._addBan.bind(this));
    Radio.channel('channels').on('ban:remove',this._removeBan.bind(this));
    Radio.channel('channels').on('mode',this._mode.bind(this));
    Radio.channel('channels').on('privmsg:start',this._startPrivmsg.bind(this));
    Radio.channel('channels').on('privmsg:add',this._addPrivmsg.bind(this));
    Radio.channel('channels').on('showChannelInfo',this._showChannelInfo.bind(this));
    Radio.channel('channels').reply('isConnected', false);
    Radio.channel('channels').reply('getServerName', this.server);
    Radio.channel('channels').reply('getActiveChannelName', 'server');
    Radio.channel('channels').reply('getChannelModel', this._getChannelModel.bind(this));
  },
  _connected(){
    if(this.collection.where({name:'server'}).length < 1){
      this._joinChannel('server');
    }
    this._connected = true;
    Radio.channel('channels').reply('isConnected', true);
    this.collection.get('server').set('topic', 'Connected');
    this.collection.each((channelModel)=>{
      if(channelModel.get('name') != 'server'){
        Radio.channel('messages').trigger('join:channel', channelModel);
      }
    });
  },

  _disconnected(){
    this._connected = false;
    Radio.channel('channels').reply('isConnected', false);
    this.collection.get('server').set('topic', 'Disconnected');
  },
  _joinChannel(name, doNotActivate, channelKey){
    if(this.collection.where({name:name}).length < 1){
   	  Radio.channel('navbar').trigger('valid','channelNameInput');
      var channelModel = new ChannelModel({name:name});
      if(channelKey){
        channelModel.set('key', channelKey);
      }
      this.collection.add(channelModel);
      var myNick = Radio.channel('users').request('getMyNick');
      if(!doNotActivate){
        Radio.channel('channels').trigger('activate', channelModel);
      }
      return channelModel;
    }else{
      Radio.channel('navbar').trigger('invalid','channelNameInput', 'Already Joined Channel');
      return null;
    }
  },
  _invalidChannelKey(messageModel){
    var joinChannel = (data)=>{
      this._joinChannel(messageModel.get('channel'), false, data.key);
    };
    Radio.channel('dialog').on('submit', joinChannel);
    Radio.channel('dialog').once('close', ()=>{
      Radio.channel('dialog').off('submit', joinChannel);
    });
    Radio.channel('dialog').trigger('open', new ChannelKeyView() );
  },
  _partChannel(channelModel){
    if(channelModel.get('name') === 'server'){
      this._disconnect();
    }
    this.collection.remove(channelModel);
    if(channelModel.get('active') && this.collection.length > 0){
      Radio.channel('channels').trigger('activate', this.collection.last() );
    }
  },
  _changeTopic(channelName, topic){
    var topicMessage = new MessageModel({
      content: topic,
      command: 'TOPIC',
      channel: channelName
    });
    Radio.channel('messages').trigger('send', topicMessage);
  },
  _changedTopic(channelName, topic){
    var topicHistory = this.collection.findWhere({name:channelName}).get('topicHistory');
    topicHistory.splice(0,0,topic);
    this.collection.findWhere({name:channelName}).set({
      'topicHistory': topicHistory,
      'topic': topic
    });
  },
  _kicked(messageModel){
    var channelName = messageModel.get('channel');
    //if it is you that is leaving the channel
    if(messageModel.get('extra') == Radio.channel('users').request('getMyNick') ){
      var channelModel = this.collection.findWhere({name:channelName});
      channelModel.set('silent', true);
      this._partChannel( channelModel );
    }
  },
  _mode(messageModel){
    var channelName = messageModel.get('channel');
    for(let modeModel of messageModel.get('modes')){
      if(modeModel.get('scopes').indexOf('userFlag') > -1){
        //for user flags
      }else if(modeModel.get('scopes').indexOf('channelFlag') > -1){
        var channelModel = this.collection.get(channelName);
        if(channelModel){
          channelModel.parseMode(modeModel);
        }
      }else if(modeModel.get('scopes').indexOf('channelBan') > -1){
        var channelModel = this.collection.get(channelName);
        if(channelModel){
          channelModel.parseMode(modeModel);
        }
      }
    }
  },
  _bans(messageModel){
    var channelName = messageModel.get('channel');
    var bans = this.collection.get(channelName).get('bans');
    var banMask = messageModel.get('modes')[0].get('param');
    if(!bans.get(banMask)){
      bans.add(new BanMaskModel({mask: banMask}));
    }
  },
  _removeBan(channelModel, banMaskModel){
     var modeModel = new ModeModel({
      flag: 'b',
      isSet: false,
      paramName: 'mask',
      param: banMaskModel.get('mask'),
      isParamAlwaysRequired: true
    });
    var removeBanMessage = new MessageModel({
      command: 'MODE',
      modes: [modeModel],
      channel: channelModel.get('name')
    });
    Radio.channel('messages').trigger('send', removeBanMessage);
  },
  _addBan(channelModel, banMask){
     var modeModel = new ModeModel({
      flag: 'b',
      isSet: true,
      paramName: 'mask',
      param: banMask,
      isParamAlwaysRequired: true
    });
    var addBanMessage = new MessageModel({
      command: 'MODE',
      modes: [modeModel],
      channel: channelModel.get('name')
    });
    Radio.channel('messages').trigger('send', addBanMessage);
  },
  _startPrivmsg(channelModel, userModel){
    var channelModel = this._getChannelModel( userModel.get('nick') );
    if(!channelModel){
      this._joinChannel( userModel.get('nick') );
    }
  },
  _addPrivmsg(messageModel){
    var myNick = Radio.channel('users').request('getMyNick');
    if(messageModel.get('channel') == myNick){
      messageModel.set('channel', messageModel.get('nick'));
    }
    var channelModel = this._getChannelModel( messageModel.get('channel') );
    if(!channelModel){
      channelModel= this._joinChannel( messageModel.get('channel'), true );
    }
    if( channelModel.get('name') != this._activeChannel.get('name') ){
      channelModel.set('stale', true);
      messageModel.set('new', true);
    }
    if( messageModel.get('content').indexOf(myNick) > -1){
      if( channelModel.get('name') != this._activeChannel.get('name') ){
        channelModel.set('alerted', true);
      }
      messageModel.set('alerted', true);
    }
  },
  _showChannelInfo(channelModel, userModel){
    var sendModes = (data)=>{
      if(data.topic){
        this._changeTopic(channelModel.get('name'), data.topic);
      }
      var modesMessage = new MessageModel({
        modes: data.modes,
        command: 'MODE',
        channel: channelModel.get('name')
      });
      Radio.channel('messages').trigger('send', modesMessage);
    };
    Radio.channel('dialog').on('submit', sendModes);
    Radio.channel('dialog').once('close', ()=>{
      Radio.channel('dialog').off('submit', sendModes);
    });
    Radio.channel('dialog').trigger('open', new ChannelInfoView({model: channelModel}) );
    var modesInfo = new MessageModel({
      command: 'MODE',
      channel: channelModel.get('name')
    });
    Radio.channel('messages').trigger('send', modesInfo);
    var bansInfoMode = modes.get('ban').clone().set('isSet', null);
    var bansInfo = new MessageModel({
      modes: [bansInfoMode],
      command: 'MODE',
      channel: channelModel.get('name')
    });
    Radio.channel('messages').trigger('send', bansInfo);
  },
  _activateChannel(channelModel){
    if(this._activeChannel){
      this._activeChannel.set('contentInputValue', Radio.channel('chat').request('getContentInputValue') );
    }
    this._activeChannel = channelModel;
    Radio.channel('channels').reply('getActiveChannelName', channelModel.get('name'));
  	this.collection.each((model)=>{
      if(model == channelModel){
        model.set({
          active: true,
          stale: false,
          alerted: false
        });
      }else{
        model.set('active', false);
      }
    });
  },
  _getChannelModel(channelName){
    return this.collection.get(channelName);
  }
});

export default new ChannelService();