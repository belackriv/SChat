'use strict';

import _ from 'underscore';
import Backbone from 'backbone';
import Service from 'backbone.service';
import Radio from 'backbone.radio';
import MessageModel from 'lib/models/messageModel';
import ChannelCollection from 'lib/models/channelCollection';
import ChannelModel from 'lib/models/channelModel';
import ChannelInfoView from 'lib/chat/channelInfo'

const ChannelService = Service.extend({
  setup(options = {}) {
    this.collection = new ChannelCollection();
    this.server = 'ws://dazed.ef.net:8080/ws';
    //this.server = "ws://localhost:8080";
  },
  start(){
    Radio.channel('channels').on('change:topic',this._changeTopic.bind(this));
    Radio.channel('channels').on('activate',this._activateChannel.bind(this));
    Radio.channel('channels').on('connect',this._connect.bind(this));
    Radio.channel('channels').on('disconnect',this._disconnect.bind(this));
    Radio.channel('channels').on('join',this._joinChannel.bind(this));
    Radio.channel('channels').on('part',this._partChannel.bind(this));
    Radio.channel('channels').on('kicked',this._kicked.bind(this));
    Radio.channel('channels').on('showChannelInfo',this._showChannelInfo.bind(this));
    
    Radio.channel('channels').reply('isConnected', false);
    Radio.channel('channels').reply('getServerName', this.server);
    Radio.channel('channels').reply('getActiveChannelName', 'server');
  },
  _connect(callback){
    if(!this._connected){
      Radio.channel('socket').trigger('connect', {
        server: this.server,
        nick: Radio.channel('users').request('getMyNick')
      });
      this._joinChannel('server');
      this._connected = true;
      Radio.channel('channels').reply('isConnected', true);
      if(typeof callback ==='function'){
        callback();
      }
    }
  },
  _disconnect(callback){
    if(this._connected){
      Radio.channel('channels').reply('isConnected', false);
      this._connected = false; 
      this._activeChannel.set('topic', 'Disconnected');
      this._partChannel(this.collection.findWhere({name:'server'}));
      Radio.channel('socket').trigger('disconnect');
      Radio.channel('users').trigger('disconnect');
      this.collection.reset();
      if(typeof callback ==='function'){
        callback();
      }
    }
  },
  _joinChannel(name){
    if(this.collection.where({name:name}).length < 1){
   	  Radio.channel('navbar').trigger('valid','channelNameInput');
      var channelModel = new ChannelModel({name:name});
      this.collection.add(channelModel);
      Radio.channel('channels').trigger('activate', channelModel);
    }else{
      Radio.channel('navbar').trigger('invalid','channelNameInput', 'Already Joined Channel');
    }
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
  _showChannelInfo(channelModel, userModel){
    var sendModes = (data)=>{
      if(data.topic){
        this._changeTopic(channelModel.get('name'), data.topic);
      }
    };
    Radio.channel('dialog').on('submit', sendModes);
    Radio.channel('dialog').once('close', ()=>{
      Radio.channel('dialog').off('submit', sendModes);  
    });
    Radio.channel('dialog').trigger('open', new ChannelInfoView({model: channelModel}) );
    var modesInfo = new MessageModel({
      extra: '',
      command: 'MODE',
      channel: channelModel.get('name')
    });
    Radio.channel('messages').trigger('send', modesInfo);
  },
  _activateChannel(channelModel){
    this._activeChannel = channelModel;
    Radio.channel('channels').reply('getActiveChannelName', channelModel.get('name'));
  	this.collection.forEach(function(model){
      if(model == channelModel){
        model.set('active', true);
      }else{
        model.set('active', false);
      }
    });
  }
});

export default new ChannelService();