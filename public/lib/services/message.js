'use strict';

import Service from 'backbone.service';
import Backbone from 'backbone';
import Radio from 'backbone.radio';
import MessageCollection from 'lib/models/messageCollection';
import MessageModel from 'lib/models/messageModel';

const MessageBufferSize = 100;

const MessageService = Service.extend({
  setup(options = {}) {
    this.channelCollection = options.channelCollection;
  },
  start(){
    Radio.channel('messages').on('receive',this._receive.bind(this));
    Radio.channel('messages').on('send',this._send.bind(this));
    this.channelCollection.on('add',this._addChannel.bind(this));
    this.channelCollection.on('remove',this._removeChannel.bind(this));
    this.channelCollection.on('reset',this._resetChannels.bind(this));
    Radio.channel('channels').on('activate',this._activateChannel.bind(this));
  },
  _receive(messageModel){
    //do stuff with certain messages
    switch(messageModel.get('command'))
    {
      case 'PING':
        this._addMessage(messageModel);
        var reply = new MessageModel({command: 'PONG',
          extra: messageModel.get('parsedMessage').params,
          channel:'server',
          content: 'PONG: '+messageModel.get('parsedMessage').params,
          timestamp: new Date()
        });
        Radio.channel('socket').trigger('send',reply);
        this._addMessage(reply);
        break;
      case 'ERR_NICKNAMEINUSE':
        this._addMessage(messageModel);
        var nick = Radio.channel('users').request('getNick')+Math.floor(Math.random() * 1001)
        var reply = new MessageModel({command: 'NICK', nick: nick, channel:'server'});
        Radio.channel('socket').trigger('send',reply);
        this._addMessage(reply);
        break;
      case 'RPL_TOPIC':
      case 'RPL_NOTOPIC':
      case 'TOPIC':
        Radio.channel('channels').trigger('change:topic',messageModel.get('channel'), messageModel.get('content') );
        var topicChangeMessage = messageModel.clone();
        var topicPrefix = messageModel.get('nick')?' * '+messageModel.get('nick')+' set topic to "':' * Topic is "';
        topicChangeMessage.set('content',topicPrefix+messageModel.get('content')+'"');
        this._addMessage(topicChangeMessage);
        break;
      default:
        this._addMessage(messageModel);
        break;
    }
  },
  _send(messageModel){
    Radio.channel('socket').trigger('send', messageModel);
  },
  _addMessage(messageModel){
    var channelName = messageModel.get('channel');
    var channelCollection = this._getMessageCollection(channelName);
    if(channelCollection){
      channelCollection.add(messageModel);
      if(channelCollection.length > MessageBufferSize){
        channelCollection.shift();
      }
    }
  },
  _addChannel(channelModel){
    var channelName = channelModel.get('name');
    if(!this._getMessageCollection(channelName)){
      this._channelMessages[channelName] = new MessageCollection();
    }
    var messageModel = new MessageModel({
      channel: channelName,
      command: 'JOIN'
    });
    Radio.channel('socket').trigger('send', messageModel);
    var joinMessageModel = new MessageModel({
      channel:channelName,
      type: 'INFO',
      content: ' * Now Talking in '+channelName,
      timestamp: new Date()
    });
    this._addMessage(joinMessageModel);
  },
  _removeChannel(channelModel){
    var channelName = channelModel.get('name');
     var messageModel = new MessageModel({
      channel: channelName,
      command: 'PART'
    });
    Radio.channel('socket').trigger('send', messageModel);
    delete this._channelMessages[channelName];
  },
  _resetChannels(){
    this._channelMessages = {};
  },
  _activateChannel(channelModel){
    Radio.channel('chat').trigger('activate',this._getMessageCollection(channelModel.get('name')), channelModel);
  },
  _getMessageCollection(channelName){
    return this._channelMessages[channelName.toLowerCase()];
  },
  _channelMessages:{}
});

export default new MessageService();