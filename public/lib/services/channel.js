'use strict';

import Service from 'backbone.service';
import Backbone from 'backbone';
import Radio from 'backbone.radio';
import ChannelCollection from 'lib/models/channelCollection';
import ChannelModel from 'lib/models/channelModel';

const ChannelService = Service.extend({
  setup(options = {}) {
    this.collection = new ChannelCollection();
    this.server = "ws://dazed.ef.net:8080/ws";
    //this.server = "ws://localhost:8080";
  },
  start(){
    Radio.channel('channels').on('change:topic',this._changeTopic.bind(this));
    Radio.channel('channels').on('activate',this._activateChannel.bind(this));
    Radio.channel('channels').on('connect',this._connect.bind(this));
    Radio.channel('channels').on('disconnect',this._disconnect.bind(this));
    Radio.channel('channels').on('join',this._joinChannel.bind(this));
    Radio.channel('channels').on('part',this._partChannel.bind(this));
    Radio.channel('channels').reply('isConnected', false);
    Radio.channel('channels').reply('getServerName', this.server);
    Radio.channel('channels').reply('getActiveChannelName', 'server');
  },
  _connect(callback){
    if(!this._connected){
      Radio.channel('socket').trigger('connect', {
        server: this.server,
        nick: Radio.channel('users').request('getNick')
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
      this._partChannel(this.collection.findWhere({name:'server'}));
      Radio.channel('channels').trigger('disconnect');
      Radio.channel('socket').trigger('disconnect');
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
      this.collection.last().set('active', true);
    }
  },
  _changeTopic(channelName, topic){
    this.collection.findWhere({name:channelName}).set('topic', topic);
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