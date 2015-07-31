'use strict';

import _ from 'underscore';
import Backbone from 'backbone';
import Service from 'backbone.service';
import Radio from 'backbone.radio';
import UserCollection from 'lib/models/userCollection';
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
      case 'JOIN':
        Radio.channel('users').trigger('join',messageModel);
        if(messageModel.get('nick') != Radio.channel('users').request('getMyNick')){
          this._addMessage(messageModel);  
        }
        break;
      case 'PART':
        Radio.channel('users').trigger('part',messageModel);
        if(messageModel.get('nick') != Radio.channel('users').request('getMyNick')){
          this._addMessage(messageModel);
        }
        break;
      case 'NICK':
        _.each(this._channelMessages, (messages, channelName)=>{
          if(Radio.channel('users').request('isUserInChannel', channelName, messageModel.get('nick'))){
            this._addMessage(messageModel.clone().set('channel', channelName));
          }
        });
        Radio.channel('users').trigger('nick',messageModel);
      case 'QUIT':
        _.each(this._channelMessages, (messages, channelName)=>{
          if(Radio.channel('users').request('isUserInChannel', channelName, messageModel.get('nick'))){
            this._addMessage(messageModel.clone().set('channel', channelName));
          }
        });
        Radio.channel('users').trigger('quit',messageModel);
        break;
      case 'MODE':
        if(messageModel.get('modeNick')){
          Radio.channel('users').trigger('mode',messageModel);
        }else{

        }
        messageModel.set('content', ' * '+messageModel.get('content') );
        this._addMessage(messageModel);
        break;
      case 'KICK':
        Radio.channel('users').trigger('kicked',messageModel);
        Radio.channel('channels').trigger('kicked',messageModel);
        var displayedMessage = messageModel.clone();
        if(messageModel.get('extra') == Radio.channel('users').request('getMyNick') ){
          displayedMessage.set('channel', 'server');
        }
        this._addMessage(displayedMessage);
        break;     
      case 'TOPIC':
      case 'RPL_TOPIC':
      case 'RPL_NOTOPIC':
        Radio.channel('channels').trigger('change:topic',messageModel.get('channel'), messageModel.get('content') );
        var topicChangeMessage = messageModel.clone();
        var topicPrefix = messageModel.get('nick')?' * '+messageModel.get('nick')+' set topic to "':' * Topic is "';
        topicChangeMessage.set('content',topicPrefix+messageModel.get('content')+'"');
        this._addMessage(topicChangeMessage);
        break;
      case 'RPL_NAMREPLY':
        Radio.channel('users').trigger('receive',messageModel);
        break;
      case 'RPL_WHOISUSER':
      case 'RPL_WHOISSERVER':
      case 'RPL_WHOISOPERATOR':
      case 'RPL_WHOISIDLE':
      case 'RPL_WHOISCHANNELS':
        messageModel.set('channel', Radio.channel('channels').request('getActiveChannelName') );
        this._addMessage(messageModel);
        break;
      case 'ERR_NICKNAMEINUSE':
        this._addMessage(messageModel);
        var nick = Radio.channel('users').request('getMyNick')+Math.floor(Math.random() * 1001)
        Radio.channel('users').trigger('changeMyNick', nick );
        //do this after, navbar view will re-render when the nick is changed.
        Radio.channel('navbar').trigger('invalid','nickInput', 'Nick In Use');
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
    channelCollection.add(messageModel);
    if(channelCollection.length > MessageBufferSize){
      channelCollection.shift();
    }
  },
  _addChannel(channelModel){
    var channelName = channelModel.get('name');
    var messageCollection = this._getMessageCollection(channelName);
    var messageModel = new MessageModel({
      channel: channelName,
      command: 'JOIN'
    });
    if(channelModel.get('silent') !== true){
      Radio.channel('socket').trigger('send', messageModel);
    }
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
    if(channelModel.get('silent') !== true){
      Radio.channel('socket').trigger('send', messageModel);
    }
    delete this._channelMessages[channelName];
  },
  _resetChannels(){
    _.each(this._channelMessages, (collection, key, obj)=>{
      collection.reset();
      delete obj[key];
    });
  },
  _activateChannel(channelModel){
    var channelName =  channelModel.get('name');
    var userCollection = Radio.channel('users').request('getChannelUsers', channelName);
    var messageCollection = this._getMessageCollection(channelName);
    Radio.channel('chat').trigger('activate',channelModel, userCollection, messageCollection);
  },
  _getMessageCollection(channelName){
    if(!Object.prototype.hasOwnProperty.call(this._channelMessages, channelName)){
      this._channelMessages[channelName] = new MessageCollection();
    }
    return this._channelMessages[channelName];
  },
  _channelMessages:{},
  //need typed stuff stored for up arrow
});

export default new MessageService();